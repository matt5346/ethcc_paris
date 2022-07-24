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
        <div class="field required">
          <div class="field__name">Choose for selling asset</div>

          <select class="input default" v-model="form.makerAsset">
            <option :value="null" disabled>Choose asset type</option>
            <option v-for="item in assetsTypes" :key="item.id" :value="item.id" v-text="item.token"></option>
          </select>
        </div>
        <div class="field">
          <div class="field__name">Amount</div>
          <input v-model="form.makerAssetAmount" type="text" class="input default" placeholder="Contract address...">
        </div>
      </div>
      <div>
        <button class="btn" @click="createCollection">Submit</button>
      </div>
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
  import {ref, reactive} from "vue";
  const store = useStore()
  const close = () => store.changeInchOrderOpen(false)

  const assetsTypes = [
    {
      id: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      token: 'USDC'
    },
    {
      id: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      token: 'DAI'
    }
  ]

  const form = reactive({
      makerAsset: '',
      makerAssetAmount: '',
  })

  const {
      isInchOrderOpen: isOpen
  } = storeToRefs(store);

  const isProcess = ref(false)

  const createCollection = () => {
      isProcess.value = true;
  }
</script>