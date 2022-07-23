<template>
  <div class="contract">
    <div class="contract__name" v-if="mode === 'contract'" v-text="contract.name"></div>
    <div class="contract__tokens" :class="{loading: contract.isUpdating}">
      <LoaderElement class="contract" v-if="contract.isUpdating">Loading...</LoaderElement>
      <template v-else>
        <TokenElement
          v-for="token in tokensView"
          :token="token"
          :isSelected="selectedTokens.includes(token.identity)"
          @choose="chooseToken(token)"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
    import TokenElement from '@/components/gallery/Token'
    import LoaderElement from '@/components/UI/Loader'
    import {computed} from "vue";
    import {useStore} from "@/store/main";
    const props = defineProps({
        contract: {
            type: Object,
            default: null
        },
        loading: {
            type: Boolean,
            required: false,
            default: false
        },
        selectedTokens: {
            type: Array,
            default: []
        },
        mode: {
            type: String,
            default: 'contract'   //  'contract' || 'tokenList'
        },
        tokens: {
            type: Array,
            default: []
        },
        byAvailable: {
            type: Boolean,
            default: false
        }
    })
    const emits = defineEmits(['chooseToken'])
    const chooseToken = (token) => emits('chooseToken', token)
    const store = useStore()

    const tokensView = computed(() => {
        if(props.mode === 'contract'){
            return (props.contract.tokens.length || !props.byAvailable)? props.contract.tokens : store.getShopTokens(props.contract.type, props.contract.address)
        }
        return props.tokens
    })
</script>
