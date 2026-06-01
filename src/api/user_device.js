import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/user_device/list',
    params,
  })
}

export function setLimit (data) {
  return request({
    url: '/user_device/setLimit',
    method: 'post',
    data,
  })
}

export function unbind (data) {
  return request({
    url: '/user_device/unbind',
    method: 'post',
    data,
  })
}

export function batchUnbind (data) {
  return request({
    url: '/user_device/batchUnbind',
    method: 'post',
    data,
  })
}

export function del (data) {
  return request({
    url: '/user_device/delete',
    method: 'post',
    data,
  })
}

export function batchDelete (data) {
  return request({
    url: '/user_device/batchDelete',
    method: 'post',
    data,
  })
}

export function clearUnbound (data) {
  return request({
    url: '/user_device/clearUnbound',
    method: 'post',
    data,
  })
}
