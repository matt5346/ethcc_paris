<template>
  <Modal
    class="manage-contract"
    @close="close"
    v-if="isOpen"
  >
    <template #title>Sell NFT</template>
    <template #default>
      <!--        <div class="form__title">Add new collection</div>-->
      <!--<div class="modal__sub-title">
        Loaded collections:
      </div>-->
      <div class="form">
        <div class="field required">
          <div class="field__name">Choose for selling asset</div>

          <select class="input default" v-model="form.takerAssetAddress">
            <option value="" disabled selected>Choose asset type</option>
            <option v-for="item in assetsTypes" :key="item.id" :value="item.id" v-text="item.token"></option>
          </select>
        </div>
        <div class="field required">
          <div class="field__name">Amount</div>
          <input v-model="form.takerAmount" type="text" class="input default" placeholder="Price of selling...">
        </div>
      </div>
      <div>
        <button class="btn" @click="createOrder">Submit</button>
      </div>
      <LoaderElement v-if="isProcess" class="absolute with-bg">Deploying...</LoaderElement>
    </template>
  </Modal>
</template>

<script setup>
  import Modal from '@/components/UI/Modal'
  import LoaderElement from '@/components/UI/Loader'

  import {useStore} from "@/store/main";
  import AppConnector from "@/crypto/AppConnector";
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
      takerAssetAddress: '',
      takerAmount: '',
  })

  const {
      isInchOrderOpen: isOpen,
      preview,
  } = storeToRefs(store);

  const isProcess = ref(false)

  const createCollection = () => {
      isProcess.value = true;
  }

  const createOrder = async () => {
    try {
      if (!form.takerAssetAddress || !form.takerAmount) {
        alert('Please fill both fields')
        return
      }

      console.log(preview.value.token, 'TOKEN')
      const order = {
        ...form,
        makerAssetAddress: preview.value.token ? preview.value.token.contractAddress : null,
        makerAmount: '1',
        tokenId: preview.value.token ? preview.value.token.id : null,
        walletAddress: '0x40F2977836b416D1EB423a7a2F3A9892b69Cc40F',
      }

      await AppConnector.connector.formHandler(order)
    } catch(err) {
      console.log(err, 'create order')
    }
  }
</script>