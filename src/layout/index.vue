<template>
  <el-config-provider :locale="appStore.setting.locale.value">
    <el-container class="app-shell" :style="{'--sideBarWidth': sideBarWidth}">
      <el-aside :width="leftWidth" class="app-left">
        <g-aside></g-aside>
      </el-aside>
      <el-container class="app-container">
        <el-header class="app-header">
          <g-header></g-header>
        </el-header>
        <div class="header-tags">
          <tags></tags>
        </div>

        <el-main class="app-main">
          <div class="page-panel">
            <router-view v-slot="{ Component }">
              <transition mode="out-in" name="el-fade-in-linear">
                <keep-alive :include="cachedTags">
                  <component :is="Component"/>
                </keep-alive>
              </transition>
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-config-provider>
</template>

<script setup>
  import { useAppStore } from '@/store/app'
  import { useTagsStore } from '@/store/tags'
  import { ref, computed } from 'vue'
  import Tags from '@/layout/components/tags/index.vue'
  import GAside from '@/layout/components/aside.vue'
  import GHeader from '@/layout/components/header.vue'

  const appStore = useAppStore()
  const tagStore = useTagsStore()
  const sideBarWidth = computed(() => appStore.setting.locale.sideBarWidth)
  const leftWidth = computed(() => 'var(--sideBarWidth)')

  const cachedTags = ref([])

  cachedTags.value = tagStore.cached
</script>

<style lang="scss" scoped>
.app-shell {
  min-height: 100vh;
  background: #f3f7ff;
}

.app-header {
  background: #ffffff;
  display: flex;
  height: 56px;
  padding: 0 12px;
  border-bottom: 1px solid #e3ebfb;
}

.header-tags {
  height: 40px;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0 12px;
  background: #ffffff;
  border-bottom: 1px solid #e3ebfb;
}

.app-left {
  transition: width 0.2s ease;
  background: #1f58d6;
  border-right: 1px solid #2f66e0;
  overflow: hidden;
}

.app-container {
  min-height: 100vh;
  overflow: hidden;
  background: #f6f9ff;
}

.app-main {
  padding: 10px;
}

.page-panel {
  height: 100%;
  border-radius: 8px;
  padding: 10px;
  background: #ffffff;
  border: 1px solid #e3ebfb;
  box-shadow: none;
}

</style>
