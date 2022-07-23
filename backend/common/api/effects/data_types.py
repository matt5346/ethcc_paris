from enum import Enum

from pydantic import AnyUrl, BaseModel

from .utils import generate_effects_ids

EffectID = Enum("EffectID", generate_effects_ids())


class Effect(BaseModel):
    name: str
    id: EffectID
    image: AnyUrl


class ModificatorPayload(BaseModel):
    contract: str
    tokenId: str
    contentUrl: str


class ApplyEffectPayload(BaseModel):
    original: ModificatorPayload
    modificator: ModificatorPayload
    sender: str
