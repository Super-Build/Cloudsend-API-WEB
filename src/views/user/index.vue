<template>
  <div>
    <el-card class="list-query" shadow="hover">
      <el-form inline label-width="120px">
        <el-form-item :label="T('Username')">
          <el-input v-model="listQuery.username" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handlerQuery">{{ T('Filter') }}</el-button>
          <el-button type="danger" @click="toAdd">{{ T('Add') }}</el-button>
          <el-button type="success" @click="toExport">{{ T('Export') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="list-body" shadow="hover">
      <el-table class="user-table" :data="listRes.list" v-loading="listRes.loading" border>
        <el-table-column prop="id" label="ID" align="center" width="90" />
        <el-table-column prop="username" :label="T('Username')" align="center" width="140" show-overflow-tooltip />
        <el-table-column prop="email" :label="T('Email')" align="center" width="220" show-overflow-tooltip />
        <el-table-column prop="nickname" :label="T('Nickname')" align="center" width="140" show-overflow-tooltip />
        <el-table-column :label="T('Group')" align="center" width="130">
          <template #default="{row}">
            <span v-if="row.group_id"> <el-tag>{{ listRes.groups?.find(g => g.id === row.group_id)?.name }} </el-tag> </span>
            <span v-else> - </span>
          </template>
        </el-table-column>
        <el-table-column :label="T('Status')" align="center" width="120">
          <template #default="{row}">
            <el-switch v-model="row.status"
                       :active-value="ENABLE_STATUS"
                       :inactive-value="DISABLE_STATUS"
                       @change="changeStatus(row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column :label="T('MaxDevices')" align="center" width="120">
          <template #default="{row}">
            <el-tag>{{ row.max_devices === -1 ? T('Unlimited') : (row.max_devices || 1) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" :label="T('Remark')" align="center" width="220" show-overflow-tooltip />
        <el-table-column prop="created_at" :label="T('CreatedAt')" align="center" width="180" />
        <el-table-column prop="updated_at" :label="T('UpdatedAt')" align="center" width="180" />
        <el-table-column :label="T('Actions')" align="center" header-align="center" width="680" fixed="right">
          <template #default="{row}">
            <div class="action-row">
              <el-button @click="toTag(row)">{{ T('UserTags') }}</el-button>
              <el-button @click="toAddressBook(row)">{{ T('UserAddressBook') }}</el-button>
              <el-button type="primary" @click="toUserDevice(row)">{{ T('DeviceManage') }}</el-button>
              <el-button @click="toEdit(row)">{{ T('Edit') }}</el-button>
              <el-button type="warning" @click="changePass(row)">{{ T('ResetPassword') }}</el-button>
              <el-button type="danger" @click="remove(row)">{{ T('Delete') }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="list-page" shadow="hover">
      <el-pagination background
                     layout="prev, pager, next, sizes, jumper"
                     :page-sizes="[10,20,50,100]"
                     v-model:page-size="listQuery.page_size"
                     v-model:current-page="listQuery.page"
                     :total="listRes.total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script setup>
  import { useRepositories, useDel, useToEditOrAdd, useChangePwd } from '@/views/user/composables'
  import { T } from '@/utils/i18n'
  import { DISABLE_STATUS, ENABLE_STATUS } from '@/utils/common_options'
  import { update } from '@/api/user'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { onMounted, watch } from 'vue'
  //列表
  const {
    listRes,
    listQuery,
    handlerQuery,
    getList,
    getGroups,
    toExport,
  } = useRepositories()

  onMounted(getGroups)

  onMounted(getList)

  watch(() => listQuery.page, getList)
  watch(() => listQuery.page_size, handlerQuery)

  const { toEdit, toAdd, toAddressBook, toTag, toUserDevice } = useToEditOrAdd()

  const { changePass } = useChangePwd()

  //删除
  const { del } = useDel()
  const remove = async (row) => {
    const res = await del(row.id)
    if (res) {
      getList(listQuery)
    }
  }

  const changeStatus = async (row) => {
    /*const confirm = await ElMessageBox.confirm(T('Confirm?', { param: T('Update') }), {
      confirmButtonText: T('Confirm'),
      cancelButtonText: T('Cancel'),
    }).catch(_ => false)
    if (!confirm) {
      return false
    }*/
    const res = await update(row).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      getList(listQuery)
    }
  }

</script>

<style scoped>
.list-body :deep(.el-card__body) {
  padding: 10px 12px;
}
.user-table :deep(.el-table__cell) {
  white-space: nowrap;
}
.user-table :deep(.el-table .cell) {
  white-space: nowrap;
  line-height: 20px;
}
.action-row {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.user-table :deep(.el-table__fixed-right) {
  z-index: 3;
}
.user-table :deep(.el-table__fixed-right .el-table__fixed-body-wrapper) {
  overflow-y: hidden !important;
  scrollbar-width: none;
}
.user-table :deep(.el-table__fixed-right .el-table__cell .cell) {
  overflow: visible;
}
.user-table :deep(.el-table__fixed-right .el-table__fixed-body-wrapper::-webkit-scrollbar) {
  width: 0;
  height: 0;
}
.user-table :deep(.el-table__body-wrapper) {
  overflow-x: auto;
  overflow-y: auto;
}
</style>
