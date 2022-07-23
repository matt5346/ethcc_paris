import importlib

from common.api.effects.services.base_effect_service import BaseEffectService
from settings import (MODEL_ADAPT_SCALE, MODEL_CHECKPOINT, MODEL_CONFIG,
                      MODEL_CPU, MODEL_FIND_BEST_FRAME, MODEL_RELATIVE,
                      SERVICE_EFFECT, ServiceEffect)



def get_effects_service() -> BaseEffectService:
    if SERVICE_EFFECT == ServiceEffect.ANIMATION:
        pkg = importlib.import_module(' animation.animation_effect_service')
        return pkg.AnimationEffectService(
            checkpoint_path=MODEL_CHECKPOINT,
            config_path=MODEL_CONFIG,
            cpu=MODEL_CPU,
            find_best_frame=MODEL_FIND_BEST_FRAME,
            adapt_scale=MODEL_ADAPT_SCALE,
            relative=MODEL_RELATIVE,
        )
    elif SERVICE_EFFECT == ServiceEffect.STYLE_TRANSFER:
        pkg = importlib.import_module('style_transfer.style_transfer_effect_service')
        return pkg.StyleTransferEffectService()
    elif SERVICE_EFFECT == ServiceEffect.CARICATURE:
        pkg = importlib.import_module('stylecarigan.style_cari_gan_effect_service')
        return pkg.StyleCariGanEffectService()
    elif SERVICE_EFFECT == ServiceEffect.CRYPTOPUNK:
        pkg = importlib.import_module('cryptopunk.cryptopunk_effect_service')
        return pkg.CryptopunkEffectService()