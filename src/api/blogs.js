import request from '@/utils/request'

export function addBlogs(data) {
  return request({
    url: '/api/blogs/publishBlog',
    method: 'post',
    data
  })
}

export function fetchList(query) {
  return request({
    url: '/api/blogs/getAllBlogs',
    method: 'get',
    params: query
  })
}
