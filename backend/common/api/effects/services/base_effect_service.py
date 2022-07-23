import asyncio
import multiprocessing as mp
from abc import ABC
from concurrent.futures import ProcessPoolExecutor

from settings import WORKERS_NUM

_EXECUTOR = ProcessPoolExecutor(
    max_workers=WORKERS_NUM, mp_context=mp.get_context("spawn")
)


class BaseEffectService(ABC):
    async def transform(self, source_content: bytes, modificator_content: bytes):
        loop = asyncio.get_event_loop()
        if self._support_async:
            result = await loop.run_in_executor(
                _EXECUTOR,
                self._perform_transformation,
                source_content,
                modificator_content,
            )
        else:
            result = self._perform_transformation(source_content, modificator_content)
        return result

    @property
    def _support_async(self) -> bool:
        return False

    def _perform_transformation(
        self, source_content: bytes, modificator_content: bytes
    ):
        raise NotImplementedError
