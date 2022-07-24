<template>
  <Modal
    class="manage-contract"
    @close="close"
    v-if="isOpen"
  >
    <template #title>Mint Premium NFT</template>
    <template #default>
      <!--        <div class="form__title">Add new collection</div>-->
      <!--<div class="modal__sub-title">
        Loaded collections:
      </div>-->
      <template v-if="!haveEnough">
        <div class="form">
          <div class="field required">
            <div class="field__name">Choose your asset</div>

            <select class="input default" v-model="form.takerAssetAddress">
              <option value="" disabled selected>Choose asset type</option>
              <option v-for="item in assetsTypes" :key="item.id" :value="item.id" v-text="item.token"></option>
            </select>
          </div>
        </div>
        <div class="modal__footer">
          <span v-if="isDisabled" class="alert">Minimum price 10 USDc</span>
          <button :disabled="isDisabled" class="btn" @click="createOrder">Submit</button>
        </div>
      </template>
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
  import {ref, reactive, computed} from "vue";
  const store = useStore()
  const close = () => store.changeInchOrderOpen(false)
  let haveEnough = ref(false)

  const assetsTypes = [
    {
      id: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      token: 'USDC'
    },
    {
      id: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      token: 'DAI'
    },
    {
      id: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      token: 'wMatic'
    },
  ]

  // todo make more
  const form = reactive({
      takerAssetAddress: '',
      takerAmount: '1',
      makerAssetAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      makerAmount: '1',
  })

  const {
      isInchOrderOpen: isOpen,
      preview,
  } = storeToRefs(store);

  const isProcess = ref(false)

  const createCollection = () => {
      isProcess.value = true;
  }

  const isDisabled = computed(() => {
    return form.takerAssetAddress ? false : true
  })

  const createOrder = async () => {
    try {
      if (!form.takerAssetAddress) {
        alert('Please fill all fields')
        return
      }

      console.log(preview.value.token, 'TOKEN')
      const order = {
        ...form,
        tokenId: preview.value.token ? preview.value.token.id : null,
        walletAddress: '0x40F2977836b416D1EB423a7a2F3A9892b69Cc40F',
      }

      await AppConnector.connector.formHandler(order)
    } catch(err) {
      console.log(err, 'create order')
    }
  }
</script>