<template>
  <div class="token-data__json">
    <JsonViewer
      :jsonObject="viewObject || {}"
    />
  </div>
</template>

<script setup>
  import {computed} from "vue";
  import JsonViewer from "@/components/UI/JsonViewer"
  import {Token} from "@/crypto/helpers";

  const props = defineProps(['structure'])
  const viewObject = computed(() => {
      return Token.generateJsonForTokenList(props.structure)
  })
</script>
