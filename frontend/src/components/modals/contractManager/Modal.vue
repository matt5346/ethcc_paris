<template>
  <Modal
    class="manage-contract"
    @close="close"
    v-if="isManageContractsOpen"
  >
    <template #title>Manage collections</template>
    <template #default>
      <div class="form">
        <div class="form__title">
          Add new collection
        </div>
        <div class="field field_divided">
          <input type="text" class="input default" placeholder="Enter collection address">
          <button class="btn" @click="alert.open('tetete')">Add</button>
        </div>
      </div>
      <div class="modal__sub-title">
        Loaded collections:
      </div>
      <div class="collection-list">
        <Collection/>
        <Collection/>
      </div>
      <div>
        <button class="btn" @click="createCollection">Create new collection</button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
  import Modal from '@/components/UI/Modal'
  import Icons from "@/components/UI/icons";
  import Collection from "@/components/modals/contractManager/Collection";

  import {useStore} from "@/store/main";
  import alert from "@/utils/alert";
  import {storeToRefs} from "pinia";
  const store = useStore()
  const close = () => store.changeManageContractView(false)

  const {
      isManageContractsOpen
  } = storeToRefs(store);

  const createCollection = () => {

  }
</script>