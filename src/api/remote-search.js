import request from '@/utils/request'

export function searchUser() {
  return request({
    url: '/api/remote-search/getAllAdminUsers',
    method: 'get'
  })
}
export function searchTag() {
  return request({
    url: '/api/remote-search/getAllTags',
    method: 'get'
  })
}
export function searchCategory() {
  return request({
    url: '/api/remote-search/searchCategory',
    method: 'get'
  })
}

// Unuse
export function transactionList(query) {
  return request({
    url: '/vue-element-admin/transaction/list',
    method: 'get',
    params: query
  })
}
