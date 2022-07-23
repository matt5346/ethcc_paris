<template>
  <Sketch class="gallery">
    <div class="block block_d2">
      <ToggleElement v-model="isJSON">View in JSON</ToggleElement>
      <div class="block block_auto-col">
        <div class="btn" @click="openFindToken">Edit if not owner</div>
        <router-link v-if="isAdmin" class="btn" :to="{name: 'Admin'}" exact-active-class="active">Admin</router-link>
      </div>
    </div>
    <LoaderElement class="collections" v-if="isCollectionsLoading">Loading...</LoaderElement>
    <template v-else>
      <ViewInJSON v-if="isJSON" :list="collections"/>
      <template v-else>
        <ContractElement
          v-for="collection in collections"
          :contract="collection"
          :byAvailable="true"
          @chooseToken="chooseToken"
        />
      </template>
    </template>
  </Sketch>
  <PreviewToken/>
</template>

<script setup>
    import Sketch from '@/components/UI/Sketch'
    import PreviewToken from '@/components/preview/Modal'
    import ContractElement from '@/components/gallery/Contract'
    import ToggleElement from '@/components/UI/Toggle'
    import LoaderElement from '@/components/UI/Loader'
    import ViewInJSON from '@/components/gallery/ViewInJSON'

    import {useStore} from "@/store/main";
    import {useRoute} from "vue-router";
    import {computed, onMounted, ref} from "vue";
    import {CollectionType} from "@/utils/collection";
    import {storeToRefs} from "pinia";
    import AppConnector from "@/crypto/AppConnector";
    import {ConnectionStore} from "@/crypto/helpers";

    const isJSON = ref(false)
    const isAdmin = ref(false)

    onMounted(async () => {
        try{
            const {connector} = await AppConnector.init()
            await connector.isUserConnected()
            isAdmin.value =  ConnectionStore.isAdmin()
        }
        catch (e) {

        }
    })

    const store = useStore()

    const {
        isCollectionsLoading
    } = storeToRefs(store)

    const route = useRoute()
    const collections = computed(() => {
        return store.getFilteredCollections(CollectionType.getTypeByPageName(route.name))
    })

    const chooseToken = token => {
        store.openPreview(token)
    }

    const openFindToken = () => store.changeFindTokenView(true)
</script>
