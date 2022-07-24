<template>
  <div class="sale-box">
    <button class="btn red" @click="submitSale">Sell NFT</button>
  </div>
</template>

<script setup>
import {useStore} from "@/store/main";
const store = useStore()

const submitSale = () => {
  console.log('sale')
  store.changeInchOrderOpen(true)
}
</script>
