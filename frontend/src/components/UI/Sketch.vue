<template>
  <div class="sketch">
    <div class="sketch__logo">
      <router-link :to="{name: 'Characters'}">
        <h1>DoCharacter</h1>
      </router-link>
    </div>
    <div class="sketch__header">
      <div class="header">
        <div>
          <!--<span class="header__return">
            <span>
              <svg viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.73633 13.5039C7.01462 13.7722 7.45776 13.7642 7.72611 13.4859C7.99447 13.2076 7.98641 12.7645 7.70812 12.4961L6.73633 13.5039ZM1 7L0.514105 6.49611C0.377288 6.62804 0.3 6.80994 0.3 7C0.3 7.19007 0.377288 7.37196 0.514105 7.50389L1 7ZM7.70812 1.50389C7.98641 1.23554 7.99447 0.792396 7.72611 0.514105C7.45776 0.235814 7.01462 0.227757 6.73633 0.496109L7.70812 1.50389ZM17 7.7C17.3866 7.7 17.7 7.3866 17.7 7C17.7 6.6134 17.3866 6.3 17 6.3L17 7.7ZM7.70812 12.4961L1.48589 6.49611L0.514105 7.50389L6.73633 13.5039L7.70812 12.4961ZM1.48589 7.50389L7.70812 1.50389L6.73633 0.496109L0.514105 6.49611L1.48589 7.50389ZM1 7.7L17 7.7L17 6.3L1 6.3L1 7.7Z"></path></svg>
            </span>
            <span>
              Return
            </span>
          </span>-->
        </div>
        <div>
          <div class="header__right">
            <div>
              <div class="search box">
                <input type="text" class="input" placeholder="Search NFT or collection">
                <span class="search__icon">
                  <svg viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 21.5L15.5 15.5M17.5 10.5C17.5 14.366 14.366 17.5 10.5 17.5C6.63401 17.5 3.5 14.366 3.5 10.5C3.5 6.63401 6.63401 3.5 10.5 3.5C14.366 3.5 17.5 6.63401 17.5 10.5Z" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </span>
              </div>
            </div>
            <div>
              <div class="identity box" v-if="connection.userIdentity">
                <a
                  class="identity__wallet"
                  target="_blank"
                  :href="getExplorerLink('account', connection.userIdentity)"
                >
                  <div v-text="userIdentityShort"></div>
                  <div v-text="connection.userNetworkName || ''"></div>
                </a>
                <div class="identity__logout" @click="logout">
                  <svg viewBox="0 0 24 24"><path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sketch__nav">
      <router-link
        class="btn sketch__nav-item"
        v-if="['TokenDetail', 'Admin'].includes(route.name)"
        :to="{name: 'Characters'}"
      >Back</router-link>
      <div class="btn sketch__nav-item" @click="openContractManage" v-else>Manage collections</div>
      <div></div>
      <router-link class="btn sketch__nav-item" :to="{name: 'Characters'}" exact-active-class="active">Characters</router-link>
      <router-link class="btn sketch__nav-item" :to="{name: 'Things'}" exact-active-class="active">Things</router-link>
      <router-link class="btn sketch__nav-item" :to="{name: 'Colors'}" exact-active-class="active">Colors & effects</router-link>
      <router-link class="btn sketch__nav-item" :to="{name: 'Achievements'}" exact-active-class="active">Achievements</router-link>
<!--      <a href="" class="btn sketch__nav-item">Admin</a>-->
    </div>
    <div class="sketch__main" :class="$attrs.class">
      <slot></slot>
    </div>
    <div class="sketch__footer">
      <span>
        © 2022 doNFT, All Rights Reserved.
      </span>
      <a target="_blank" href="https://mobile.twitter.com/DoNFTio">
        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="48px" height="48px"><path fill="#03A9F4" d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429"/></svg>
        Our twitter
      </a>
    </div>
  </div>
</template>

<script>
    export default {
        inheritAttrs: false
    }
</script>
<script setup>
    import {useStore} from "@/store/main";
    import {storeToRefs} from "pinia";
    import {catToFixed} from "@/utils/string";
    import {ConnectionStore} from '@/crypto/helpers'
    import {useRoute, useRouter} from "vue-router";
    const store = useStore()
    const {
        connection,
        userIdentityShort,
        getExplorerLink
    } = storeToRefs(store);
    const openContractManage = () => store.changeManageContractView(true)
    const logout = async () => {
        await ConnectionStore.logOut()
    }

    const router = useRouter()
    const route = useRoute()
</script>