<template>
  <el-scrollbar class="tags-scroll">
    <div class="tags-wrap">
      <el-tag v-for="(t, i) in tags"
              :key="t.name"
              class="tag"
              :closable="t.closeable"
              @close="close(t)"
              @click="toTag(t)"
              :type="t.active?'primary':'info'"
              :effect="t.active?'dark':'plain'">
        {{ T(t.title) }}
      </el-tag>
    </div>
  </el-scrollbar>
</template>

<script>
  import { defineComponent, ref, onMounted, watch } from 'vue'
  import { useTagsStore } from '@/store/tags'
  import { useRoute, useRouter } from 'vue-router'
  import { T } from '@/utils/i18n'

  export default defineComponent({
    name: 'Index',
    setup () {
      const tags = ref([])
      const tagsStore = useTagsStore()
      const route = useRoute()
      const router = useRouter()
      tags.value = tagsStore.tags

      const addTag = (route) => {
        if (!route.meta?.hide && route.name) {
          tagsStore.addTag(route)
        }
      }
      const close = (tag) => {
        tagsStore.removeTag(tag)
        if (tag.active) {
          toLastTag()
        }
      }
      const toLastTag = () => {
        if (tags.value.length) {
          router.push({ name: tags.value[tags.value.length - 1].name })
        }
      }
      const init = () => {
        if (!tagsStore.tags.length) {
          tagsStore.initTags()
        }
        addTag(route)
      }

      const toTag = (tag) => {
        if (tag.name !== route.name) {
          router.push({ name: tag.name })
        }
      }

      onMounted(init)
      watch(route, (val) => {
        addTag(val)
      })
      return {
        tags,
        addTag,
        close,
        toLastTag,
        toTag,
        T,
      }
    },
  })
</script>

<style lang="scss" scoped>
.tags-scroll {
  width: 100%;
}

.tags-wrap {
  display: flex;
  align-items: center;
  min-height: 36px;
  padding: 0;
}

.tag {
  border-radius: 6px;
  cursor: pointer;
  margin-right: 8px;
  padding: 0 6px;
  border: 1px solid #d8e4fb;
  background: #ffffff;
  color: #3b4c65;
  transition: all 0.2s ease;
  font-size: 13px;

  &:hover {
    border-color: #8db0fb;
    color: #1f58d6;
  }

  :deep(.el-tag__close) {
    color: inherit;
  }

  &[effect='dark'] {
    background: #1f58d6;
    border-color: #1f58d6;
    color: #fff;
  }
}
</style>
