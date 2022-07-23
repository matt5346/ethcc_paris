<template>
  <div className="gallery__json">
    <JsonViewer
      :jsonObject="viewStructure || {}"
    />
  </div>
</template>

<script setup>
    import {computed} from "vue";
    import JsonViewer from "@/components/UI/JsonViewer"
    import {Token} from "@/crypto/helpers";


    const props = defineProps(['list'])
    const viewStructure = computed(() => {
        return Token.generateJsonViewForContractList(props.list)
    })
</script>
