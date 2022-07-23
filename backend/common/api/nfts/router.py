from typing import List

from fastapi import APIRouter

from settings import GRAPH_URL

from .service import NFTService

service = NFTService(GRAPH_URL)

router = APIRouter(prefix="/nfts")


@router.get("/{account_address}")
async def get_nfts(account_address: str) -> List:
    """
    Gets NFT metas from the Graph by account address. Works with Maninnet only
    :param account_address:
    :return: json
    """
    result = await service.get_nfts_from_graph(account_address)
    return result
