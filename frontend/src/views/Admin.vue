<template>
  <Sketch class="admin">
    <LoaderElement class="collections" v-if="isLoading">Loading...</LoaderElement>
    <template v-else>
      <div class="admin__contracts">
        <Contract
          v-for="contract in whiteList"
          :key="contract.contractAddress"
          :contract="contract"
        />
      </div>

      <span class="btn" @click="openAddForm">Add contract</span>
    </template>
  </Sketch>
</template>

<script setup>
    import Sketch from '@/components/UI/Sketch'
    import LoaderElement from '@/components/UI/Loader'
    import Contract from '@/components/admin/Contract'


    import {storeToRefs} from "pinia";
    import {useStore} from "@/store/main";
    import {onMounted, ref} from "vue";
    import AppConnector from "@/crypto/AppConnector";
    const store = useStore()

    const {
        whiteList,
        isWhiteListLoading: isLoading
    } = storeToRefs(store)

    onMounted(async() => {
        await AppConnector.connector.getWhiteList({withMeta: true})
    })

    const openAddForm = () => store.changeAddToWhiteListState(true)

    // const route = useRoute()
</script>
