from fastapi import APIRouter

from settings import PROJECT_VERSION

from .effects.router import router as effects_router
from .ipfs.router import router as ipfs_router
from .nfts.router import router as nfts_router

router = APIRouter(prefix="/api")

router.include_router(nfts_router)
router.include_router(effects_router)
router.include_router(ipfs_router)


@router.get("/healthcheck")
async def healthcheck() -> str:
    return f"Do[NFT] Backend v.{PROJECT_VERSION}"
