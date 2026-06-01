<template>
  <el-menu
          class="menus"
          :default-active="activeIndex"
          background-color="transparent"
          text-color="#dbe8ff"
          active-text-color="#ffffff"
          router
  >
    <menu-item v-for="(route,index) in routes" :key="route.name" :route="route"></menu-item>
  </el-menu>
</template>

<script>
  import { defineComponent, ref, computed } from 'vue'
  import { useRouteStore } from '@/store/router'
  import MenuItem from '@/layout/components/menu/item.vue'
  import { useRoute } from 'vue-router'

  export default defineComponent({
    name: 'Menu',
    created () {
    },
    components: { MenuItem },
    setup () {
      const routes = ref([])
      const route = useRoute()
      const activeIndex = computed(() => route.name)

      routes.value = useRouteStore().routes
      return {
        routes,
        activeIndex,
      }
    },

  })
</script>

<style lang="scss" scoped>
  .menus {
    min-height: calc(100vh - 56px);
    border-right: none;
    width: var(--sideBarWidth);
    padding: 10px 6px 12px;
    :deep(.el-sub-menu__title),
    :deep(.el-menu-item) {
      height: 40px;
      line-height: 40px;
      border-radius: 6px;
      margin-bottom: 6px;
      padding-left: 12px !important;
      padding-right: 12px !important;
      transition: all 0.2s ease;
      font-weight: 500;
    }
    :deep(.el-menu-item:hover),
    :deep(.el-sub-menu__title:hover) {
      background: rgba(255, 255, 255, 0.16);
      color: #ffffff;
    }
    :deep(.el-menu-item.is-active) {
      background: rgba(255, 255, 255, 0.24);
      box-shadow: none;
    }
    :deep(.el-sub-menu .el-menu) {
      background: transparent;
    }
    :deep(.el-menu-item .el-icon),
    :deep(.el-sub-menu__title .el-icon) {
      font-size: 17px;
      color: #f2f6ff;
    }
    :deep(.el-menu-item span),
    :deep(.el-sub-menu__title span) {
      color: #f2f6ff;
      opacity: 1;
    }
    :deep(.el-sub-menu__icon-arrow) {
      right: 10px;
    }
  }
</style>
<style>
</style>
