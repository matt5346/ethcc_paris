import json
import logging
from abc import ABC, abstractmethod
import re
from typing import Any, Dict, Literal, Optional, Tuple, TypeVar

from aiohttp import ClientSession, ClientTimeout

from settings import IPFS_API_TIMEOUT, PINATA_JWT_TOKEN, IPFS_SERVICE, NFT_STORAGE_API_TOKEN, IPFSServiceEnum


class IPFSServiceException(Exception):
    pass


BASE_IPFS_SERVICE_TYPE = TypeVar("BASE_IPFS_SERVICE_TYPE", bound="BaseIPFSService")


class BaseIPFSService(ABC):
    PINATA_ENDPOINT_REGEX = re.compile(r'pinata.cloud/ipfs/(?P<cid>\w+)')
    IPFS_ENDPOINT_REGEX = re.compile(r'ipfs.io/ipfs/(?P<cid>\w+)')
    @abstractmethod
    async def add(self, payload: bytes, only_hash: bool = False) -> str:
        pass

    @abstractmethod
    async def cat(self, ipfs_addr: str) -> bytes:
        pass

    @classmethod
    def extract_cid(cls, endpoint: str) -> Optional[str]:
        if endpoint.startswith('ipfs://'):
            return endpoint.replace('ipfs://', '')
        if res := cls.PINATA_ENDPOINT_REGEX.search(endpoint):
            return res.group('cid')
        if res := cls.IPFS_ENDPOINT_REGEX.search(endpoint):
            return res.group('cid')
        return None


class IPFSService(BaseIPFSService):

    def __init__(self, base_url: str, timeout: float = 5):
        self.base_url = base_url.rstrip("/") + "/"
        self.timeout = ClientTimeout(timeout)

    async def _make_request(
            self,
            ipfs_method: Literal["add", "cat", "get"],
            params: Dict,
            data: Optional[Dict] = None,
    ) -> bytes:
        async with ClientSession(timeout=self.timeout) as session:
            resp = await session.post(
                self.base_url + ipfs_method, params=params, data=data
            )
            if resp.status != 200:
                raise IPFSServiceException(
                    f"Request to ipfs {self.base_url} got unexpected status {resp.status}"
                )
            return await resp.read()

    async def add(self, payload: bytes, only_hash: bool = False) -> str:
        result = await self._make_request(
            "add", {"only-hash": str(only_hash).lower()}, {"file": payload}
        )
        try:
            decoded = json.loads(result)
            return decoded["Hash"]
        except ValueError:
            raise IPFSServiceException(f"Got invalid json while adding file: {result}")
        except KeyError:
            raise IPFSServiceException(f"Hash key not found in response: {result}")

    async def cat(self, ipfs_addr: str) -> bytes:
        result = await self._make_request(
            "cat", {"arg": ipfs_addr.replace("ipfs://", "")}
        )
        return result

class NTFStorageIPFSService(BaseRestfulIPFSService):
    _dest_formfield_name = "file"

    def _get_authorization_info(self) -> Tuple[Literal["params", "headers"], Dict[str, Any]]:
        return "headers", {"Authorization": f"Bearer {NFT_STORAGE_API_TOKEN}"}

    async def add(self, payload: bytes, only_hash: bool = False) -> str:
        logging.info("[Info] Uploading file to IPFS")
        resp = await self._make_request(
            "post",
            "https://api.nft.storage/upload",
            data={
                self._dest_formfield_name: payload
            }
        )
        #file_url = f"{json.loads(resp)["value"]["cid"]}/{self._dest_formfield_name}"
        #logging.info("cid is {file_url}")
        return f'{json.loads(resp)["value"]["cid"]}/{self._dest_formfield_name}'

    async def cat(self, ipfs_addr: str) -> bytes:
        cid = ipfs_addr.replace('ipfs://', '')
        if cid.startswith('Q'):  # V0 CID
            url = f"https://nftstorage.link/ipfs/{cid}"
        else:
            url = f"https://{cid}.ipfs.nftstorage.link/{self._dest_formfield_name}"
        logging.info("[Info] Getting file from {url}")
        return await self._make_request("get", url)


_service_mapping = {
    IPFSServiceEnum.PINATA: PinataIPFSService,
    IPFSServiceEnum.NFT_STORAGE: NTFStorageIPFSService
}


def get_ipfs_service() -> BASE_IPFS_SERVICE_TYPE:
    logging.info("[Info] IPFS provider is {IPFS_SERVICE}")
    service_cls = _service_mapping[IPFS_SERVICE]
    return service_cls(IPFS_API_TIMEOUT)


ipfs_service = get_ipfs_service()
