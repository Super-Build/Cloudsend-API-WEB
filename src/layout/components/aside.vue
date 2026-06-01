<template>
  <div class="side-shell">
    <el-scrollbar class="scroll-sidebar" height="100vh">
      <menus></menus>
    </el-scrollbar>
  </div>
</template>
<script>
  import Menus from '@/layout/components/menu/index.vue'
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'GAside',
    components: { Menus },
  })
</script>

<style scoped lang="scss">
.side-shell {
  height: 100vh;
  border-radius: 0;
  background: #1f58d6;
  overflow: hidden;
}
.scroll-sidebar {
  height: 100vh;
}
</style>
