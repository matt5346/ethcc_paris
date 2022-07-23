<template>
  <div class="item" :class="{active: isActive}">
    <div class="item__info">
      <div>
        <div class="item__info-name" @click="activeToggle">DoNFTEffectCollectible</div>
        <div class="item__info-address">
          <a href="#">0x39ab...c509 <component :is="Icons.newTab"></component></a>
          <component :is="Icons.copy"></component>
        </div>
      </div>
      <div @click="activeToggle">
        <svg viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.3536 0.853553C11.5488 0.658291 11.5488 0.341709 11.3536 0.146447C11.1583 -0.0488155 10.8417 -0.0488155 10.6464 0.146447L11.3536 0.853553ZM6 5.5L5.64645 5.85355C5.74022 5.94732 5.86739 6 6 6C6.13261 6 6.25979 5.94732 6.35355 5.85355L6 5.5ZM1.35355 0.146447C1.15829 -0.0488155 0.841709 -0.0488155 0.646447 0.146447C0.451184 0.341709 0.451184 0.658291 0.646447 0.853553L1.35355 0.146447ZM10.6464 0.146447L5.64645 5.14645L6.35355 5.85355L11.3536 0.853553L10.6464 0.146447ZM6.35355 5.14645L1.35355 0.146447L0.646447 0.853553L5.64645 5.85355L6.35355 5.14645Z" fill="#F5F5F5"></path></svg>
      </div>
    </div>
    <div class="item__contain">
      <Section/>
      <Section/>
    </div>
  </div>
</template>

<script setup>
    import Icons from "@/components/UI/icons";
    import Section from "@/components/modals/contractManager/CollectionContainSection";
    import {ref} from "vue";

    const isActive = ref(false)
    const activeToggle = () => isActive.value = !isActive.value
</script>