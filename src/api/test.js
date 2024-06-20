import request from '@/utils/request'

export const illnessTypeList = (query) => {
  return request({
    url: '/api/illness/list',
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'get',
    data: null
  })
}
