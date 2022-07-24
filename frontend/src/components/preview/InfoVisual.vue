<template>
  <div class="token-data__visual">
    <template v-for="prop in viewProps">
      <div v-text="'Token ID' + ':'"></div>
      <div class="token-data__visual__copy">
        <div v-text="`${props.tokenId.substring(0, 3)}...${props.tokenId.slice(props.tokenId.length - 8)}`"></div>
        <CopyIcon :value="props.tokenId"/>
      </div>
      <div v-text="prop.name + ':'"></div>
      <div v-text="prop.value"></div>
    </template>
  </div>
</template>

<script setup>
  import CopyIcon from "@/components/UI/CopyIcon";
  import {computed} from "vue";

  const propKeys = {
      name: 'Name',
      description: 'Description',
      link: 'Outer link'
  }

  const props = defineProps(['props', 'tokenId'])
  const viewProps = computed(() => {
      return [...props.props].map(prop => {
          prop.name = propKeys[prop.key]
          return prop
      })
  })
</script>
