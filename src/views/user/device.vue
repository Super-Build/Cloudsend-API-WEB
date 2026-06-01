<template>
  <div>
    <el-card class="list-query" shadow="hover">
      <el-form inline label-width="120px">
        <el-form-item :label="T('SearchByUsername')">
          <el-input v-model="listQuery.username" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item :label="T('User')">
          <el-select v-model="listQuery.user_id" clearable @change="onUserChange" style="width: 180px">
            <el-option
              v-for="item in filteredUsers"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="T('MaxDevices')">
          <el-input-number v-model="maxDevices" :min="-1" :max="10000" />
          <span style="margin-left: 8px; color: #999;">{{ T('MaxDevicesTips') }}</span>
        </el-form-item>
        <el-form-item class="action-buttons">
          <el-button type="primary" @click="saveLimit">{{ T('Save') }}</el-button>
          <el-button type="primary" @click="handlerQuery">{{ T('Filter') }}</el-button>
          <el-button type="warning" @click="toBatchUnbind">批量解绑</el-button>
          <el-button type="danger" @click="toBatchDelete">{{ T('BatchDelete') }}</el-button>
          <el-button @click="toClearUnbound">清除已解绑</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="list-body" shadow="hover">
      <el-table :data="listRes.list" v-loading="listRes.loading" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="50" />
        <el-table-column prop="username" :label="T('Username')" align="center" width="140" />
        <el-table-column prop="hostname" label="主机名" align="center" show-overflow-tooltip />
        <el-table-column prop="uuid" :label="T('Uuid')" align="center" show-overflow-tooltip />
        <el-table-column prop="platform" :label="T('Platform')" align="center" width="120" />
        <el-table-column prop="ip" :label="T('Ip')" align="center" width="150" />
        <el-table-column :label="T('Status')" align="center" width="120">
          <template #default="{row}">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? T('Bound') : T('Unbound') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="T('FirstLoginAt')" align="center" width="180">
          <template #default="{row}">
            {{ row.first_login_at || '-' }}
          </template>
        </el-table-column>
        <el-table-column :label="T('LastLoginAt')" align="center" width="180">
          <template #default="{row}">
            {{ row.last_login_at || '-' }}
          </template>
        </el-table-column>
        <el-table-column :label="T('Actions')" align="center" width="220" fixed="right">
          <template #default="{row}">
            <el-button type="warning" :disabled="row.status !== 1" @click="toUnbind(row)">{{ T('UnBind') }}</el-button>
            <el-button type="danger" @click="toDelete(row)">{{ T('Delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="list-page" shadow="hover">
      <el-pagination
        background
        layout="prev, pager, next, sizes, jumper"
        :page-sizes="[10, 20, 50, 100]"
        v-model:page-size="listQuery.page_size"
        v-model:current-page="listQuery.page"
        :total="listRes.total"
      />
    </el-card>
  </div>
</template>

<script setup>
  import { computed, reactive, ref, watch, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { loadAllUsers } from '@/global'
  import { list, setLimit, unbind, batchUnbind, del, batchDelete, clearUnbound } from '@/api/user_device'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { T } from '@/utils/i18n'

  const route = useRoute()
  const { allUsers, getAllUsers } = loadAllUsers()
  const maxDevices = ref(1)

  const listRes = reactive({
    list: [],
    total: 0,
    loading: false,
  })

  const listQuery = reactive({
    page: 1,
    page_size: 10,
    user_id: route.query?.user_id ? parseInt(route.query.user_id) : null,
    username: '',
  })

  const filteredUsers = computed(() => {
    if (!listQuery.username) {
      return allUsers.value
    }
    return allUsers.value.filter(v => v.username?.toLowerCase().includes(listQuery.username.toLowerCase()))
  })

  const normalizeMaxDevices = (value) => {
    if (value === -1) {
      return -1
    }
    if (!value || value < 1) {
      return 1
    }
    if (value > 10000) {
      return 10000
    }
    return value
  }

  const getCurrentUser = () => {
    if (!listQuery.user_id) {
      return null
    }
    return allUsers.value.find(item => item.id === listQuery.user_id) || null
  }

  const syncMaxDevices = () => {
    const user = getCurrentUser()
    maxDevices.value = normalizeMaxDevices(user?.max_devices ?? 1)
  }

  const getList = async () => {
    listRes.loading = true
    const params = {
      ...listQuery,
      username: listQuery.username || undefined,
    }
    const res = await list(params).catch(_ => false)
    listRes.loading = false
    if (res) {
      listRes.list = res.data.list
      listRes.total = res.data.total
    }
  }

  const handlerQuery = () => {
    if (listQuery.page === 1) {
      getList()
    } else {
      listQuery.page = 1
    }
  }

  const onUserChange = () => {
    syncMaxDevices()
    handlerQuery()
  }

  const saveLimit = async () => {
    if (!listQuery.user_id) {
      ElMessage.warning(T('PleaseSelectData'))
      return
    }
    const normalized = normalizeMaxDevices(maxDevices.value)
    maxDevices.value = normalized
    const res = await setLimit({
      user_id: listQuery.user_id,
      max_devices: normalized,
    }).catch(_ => false)
    if (res) {
      const user = getCurrentUser()
      if (user) {
        user.max_devices = normalized
      }
      ElMessage.success(T('OperationSuccess'))
    }
  }

  const toUnbind = async (row) => {
    const cf = await ElMessageBox.confirm(T('Confirm?', { param: T('UnBind') }), {
      confirmButtonText: T('Confirm'),
      cancelButtonText: T('Cancel'),
      type: 'warning',
    }).catch(_ => false)
    if (!cf) {
      return
    }
    const res = await unbind({ id: row.id }).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList()
    }
  }

  const multipleSelection = ref([])
  const handleSelectionChange = (val) => {
    multipleSelection.value = val
  }

  const toBatchUnbind = async () => {
    const ids = multipleSelection.value.filter(v => v.status === 1).map(v => v.id)
    if (!ids.length) {
      ElMessage.warning(T('PleaseSelectData'))
      return
    }
    const cf = await ElMessageBox.confirm(T('Confirm?', { param: '批量解绑' }), {
      confirmButtonText: T('Confirm'),
      cancelButtonText: T('Cancel'),
      type: 'warning',
    }).catch(_ => false)
    if (!cf) {
      return
    }
    const res = await batchUnbind({ ids }).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList()
    }
  }

  const toDelete = async (row) => {
    const cf = await ElMessageBox.confirm(T('Confirm?', { param: T('Delete') }), {
      confirmButtonText: T('Confirm'),
      cancelButtonText: T('Cancel'),
      type: 'warning',
    }).catch(_ => false)
    if (!cf) {
      return
    }
    const res = await del({ id: row.id }).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList()
    }
  }

  const toBatchDelete = async () => {
    const ids = multipleSelection.value.map(v => v.id)
    if (!ids.length) {
      ElMessage.warning(T('PleaseSelectData'))
      return
    }
    const cf = await ElMessageBox.confirm(T('Confirm?', { param: T('BatchDelete') }), {
      confirmButtonText: T('Confirm'),
      cancelButtonText: T('Cancel'),
      type: 'warning',
    }).catch(_ => false)
    if (!cf) {
      return
    }
    const res = await batchDelete({ ids }).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList()
    }
  }

  const toClearUnbound = async () => {
    const cf = await ElMessageBox.confirm(T('Confirm?', { param: '清除已解绑' }), {
      confirmButtonText: T('Confirm'),
      cancelButtonText: T('Cancel'),
      type: 'warning',
    }).catch(_ => false)
    if (!cf) {
      return
    }
    const payload = listQuery.user_id ? { user_id: listQuery.user_id } : {}
    const res = await clearUnbound(payload).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList()
    }
  }

  onMounted(async () => {
    await getAllUsers()
    syncMaxDevices()
    getList()
  })

  watch(() => listQuery.page, getList)
  watch(() => listQuery.page_size, handlerQuery)
</script>

<style scoped lang="scss">
.list-query .el-select {
  --el-select-width: 180px;
}
.action-buttons {
  margin-left: 4px;
}
.action-buttons :deep(.el-button) {
  margin-right: 8px;
}
.list-body :deep(.el-table) {
  width: 100%;
}
</style>
