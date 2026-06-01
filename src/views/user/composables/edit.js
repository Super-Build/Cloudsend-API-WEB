import { ref, onMounted, reactive } from 'vue'
import { create, detail, update } from '@/api/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { list as groups } from '@/api/group'
import { T } from '@/utils/i18n'

export function useGetDetail (id) {
  const item = ref({})
  const form = ref({ max_devices: 1 })
  const groupsList = ref([])

  const getDetail = async (detailId) => {
    const res = await detail(detailId)
    item.value = { ...res.data }
    form.value = { ...res.data }
    if (!form.value.max_devices || form.value.max_devices < 1) {
      form.value.max_devices = 1
    }
  }

  if (id > 0) {
    onMounted(() => {
      getDetail(id)
    })
  }

  const getGroups = async () => {
    const res = await groups({ page_size: 9999 }).catch(_ => false)
    if (res) {
      groupsList.value = res.data.list
    }
  }

  onMounted(getGroups)

  return {
    form,
    item,
    getDetail,
    groupsList,
  }
}

export function useSubmit (form, id) {
  const root = ref(null)
  const router = useRouter()
  const rules = reactive({
    username: [{ required: true, message: T('ParamRequired', { param: T('Username') }) }],
    group_id: [{ required: true, message: T('ParamRequired', { param: T('Group') }) }],
    status: [{ required: true, message: T('ParamRequired', { param: T('Status') }) }],
    max_devices: [{
      required: true,
      validator: (_rule, value, callback) => {
        if (value === -1 || (value >= 1 && value <= 10000)) {
          callback()
          return
        }
        callback(new Error(T('MaxDevicesInvalid')))
      },
      trigger: 'blur',
    }],
  })

  const validate = async () => {
    const res = await root.value.validate().catch(() => false)
    return res
  }

  const submitCreate = async () => {
    const res = await create(form.value).catch(_ => false)
    return res.code === 0
  }

  const submitUpdate = async () => {
    const res = await update(form.value).catch(_ => false)
    return res.code === 0
  }

  const submitFunc = id > 0 ? submitUpdate : submitCreate

  const submit = async () => {
    const v = await validate()
    if (!v) {
      return
    }

    const res = await submitFunc()
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      router.back()
    }
  }

  const cancel = () => {
    router.back()
  }

  return {
    root,
    rules,
    validate,
    submit,
    cancel,
  }
}
