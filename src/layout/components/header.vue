<template>
  <div class="header-wrap">
    <div class="header-logo">
      <img :src="setting.logo" alt="" class="logo">
      <div class="title">{{setting.title}}</div>
    </div>
    <Setting></Setting>
  </div>
</template>

<script>
  import { defineComponent, computed } from 'vue'
  import Setting from '@/layout/components/setting/index.vue'
  import { useAppStore } from '@/store/app'

  export default defineComponent({
    name: 'LayerHeader',
    created () {
    },
    components: { Setting },
    watch: {},
    setup (props) {
      const appStore = useAppStore()
      const setting = computed(() => appStore.setting)
      return {
        setting,
      }
    },

  })
</script>

<style scoped lang="scss">
  .header-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0;
    border-radius: 0;
    background: #ffffff;
  }

  .header-logo {
    display: flex;
    height: 100%;
    align-items: center;
    color: #0f172a;

    .title {
      display: block;
      margin-left: 10px;
      font-size: 16px;
      font-weight: 600;
    }

    .logo {
      display: block;
      width: 28px;
      height: 28px;
      border-radius: 6px;
    }
  }

</style>
