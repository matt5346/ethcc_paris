<template>
  <Modal
    class="manage-contract"
    @close="close"
    v-if="isOpen"
  >
    <template #title>Create collections</template>
    <template #default>
      <!--        <div class="form__title">Add new collection</div>-->
      <!--<div class="modal__sub-title">
        Loaded collections:
      </div>-->
      <div class="form">
        <div class="field">
          <div class="field__name">Enter server URL for modify assets</div>
          <input type="text" class="input default" placeholder="URL...">
        </div>
        <div class="field">
          <div class="field__name">If available only for a specific contract enter this contract address</div>
          <input type="text" class="input default" placeholder="Contract address...">
        </div>
      </div>
      <!--<div>
        <button class="btn" @click="createCollection">Deploy contract</button>
      </div>-->
      <LoaderElement v-if="isProcess" class="absolute with-bg">Deploying...</LoaderElement>
    </template>
  </Modal>
</template>

<script setup>
  import Modal from '@/components/UI/Modal'
  import LoaderElement from '@/components/UI/Loader'

  import {useStore} from "@/store/main";
  // import alert from "@/utils/alert";
  import {storeToRefs} from "pinia";
  import {ref} from "vue";
  const store = useStore()
  const close = () => store.changeManageContractView(false)

  const {
      isDeployContractOpen: isOpen
  } = storeToRefs(store);

  const isProcess = ref(false)

  const createCollection = () => {
      isProcess.value = true;
  }
</script>