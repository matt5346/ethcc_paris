<template>
  <div class="item__info">
    <div>
      <div class="item__info-name">DoNFTEffectCollectible</div>
      <div class="item__info-address">
        <a href="#">0x39ab...c509 <component :is="Icons.newTab"></component></a>
        <component :is="Icons.copy"></component>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script setup>
    import Icons from "@/components/UI/icons";
</script>