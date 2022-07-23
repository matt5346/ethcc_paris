import asyncio
import logging
from typing import List
from io import BytesIO

import requests
from aiohttp import ClientSession, ClientTimeout
from fastapi import APIRouter, HTTPException, responses

from common.api.ipfs.service import ipfs_service, PinataIPFSService, IPFSService
from common.eth.service import get_service_cls
from get_effects_service import get_effects_service
from settings import ETH_NODE, IPFS_API_TIMEOUT, IPFS_API_HOST

from .data_types import ApplyEffectPayload, Effect
from .utils import LoadImageError, GenerationImageError, ResponseError
from ..ipfs.service import IPFSServiceException

router = APIRouter(prefix="/effects")

service = get_effects_service()

web3_service = get_service_cls()(ETH_NODE)


async def _fetch_content(content_url: str, timeout: float = 20) -> bytes:
    logging.info("[Info] Fetching {content_url}")
    try:
        extracted_cid = ipfs_service.extract_cid(content_url)
        if extracted_cid is not None:
            logging.info("[Info] Getting cid {extracted_cid}")
            return await ipfs_service.cat(extracted_cid)
        elif 'ipfs' in content_url:
            logging.info("[Info] by http client")
            async with ClientSession(timeout=ClientTimeout(timeout)) as session:
                resp = await session.get(content_url)
                return await resp.read()
        else:
            return requests.get(content_url).content

    except Exception:
        raise LoadImageError("[Error] Didn't load file from " + content_url)


@router.post("/applyEffect")
async def apply_effect(effect_payload: ApplyEffectPayload):
    logging.info("[Info]Checking ownerships of original {effect_payload.original.contract}:{effect_payload.original.tokenId} to sender {effect_payload.sender}")
    if not web3_service.has_token_ownership(
        effect_payload.original.contract,
        effect_payload.original.tokenId,
        effect_payload.sender,
    ):
        raise HTTPException(
            status_code=403, detail="original does not belong to sender"
        )

    logging.info("[Info]Checking ownerships of original {effect_payload.original.contract}:{effect_payload.original.tokenId} to sender {effect_payload.sender}")
    if not web3_service.has_token_ownership(
        effect_payload.modificator.contract,
        effect_payload.modificator.tokenId,
        effect_payload.sender,
    ):
        raise HTTPException(
            status_code=403, detail="modificator does not belong to sender"
        )
    logging.info("[Info] Fetching content")
    image_content, modificator_content = await asyncio.gather(
        _fetch_content(effect_payload.original.contentUrl),
        _fetch_content(effect_payload.modificator.contentUrl),
    )

    logging.info("[Info] Generating content")
    try:
        transformed = await service.transform(image_content, modificator_content)
    except Exception:
        raise GenerationImageError("[Error] Failed to generate image")

    logging.info("[Info] Uploading content")
    try:
        ipfs_url = await ipfs_service.add(transformed)
    except Exception:
        raise IPFSServiceException("[Error] IPFS service error")

    logging.info("[Info] Responding")
    try:
        response_stream = BytesIO(transformed)
        res = responses.StreamingResponse(
            response_stream,
            media_type="image/jpeg",
            headers={"ContentUrl": f"ipfs://{ipfs_url}", "Access-Control-Expose-Headers": "ContentUrl"}
        )
    except Exception:
        raise ResponseError('[Error] Failed to send result')
    return res


@router.get("/")
async def get_effects() -> List[Effect]:
    return list(service.get_effects())
