import request from '@/utils/request'
export const Login = (data) => {
  return request({
    url: '/api/user/login',
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'post',
    data: data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/api/user/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return {
    "msg": "操作成功",
    "code": 200,
    "permissions": [
      "*:*:*"
    ],
    "roles": [
      "admin"
    ],
    "user": {
      "createBy": "admin",
      "createTime": "2024-04-09 05:40:40",
      "updateBy": null,
      "updateTime": null,
      "remark": "管理员",
      "params": {
        "@type": "java.util.HashMap"
      },
      "userId": 1,
      "deptId": 103,
      "userName": "admin",
      "nickName": "666",
      "email": "ry@163.com",
      "phonenumber": "15888888888",
      "sex": "1",
      "avatar": "",
      "password": "$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2",
      "status": "0",
      "delFlag": "0",
      "loginIp": "127.0.0.1",
      "loginDate": "2024-06-20T21:54:04.000+08:00",
      "dept": {
        "createBy": null,
        "createTime": null,
        "updateBy": null,
        "updateTime": null,
        "remark": null,
        "params": {
          "@type": "java.util.HashMap"
        },
        "deptId": 103,
        "parentId": 101,
        "ancestors": "0,100,101",
        "deptName": "研发部门",
        "orderNum": 1,
        "leader": "若依",
        "phone": null,
        "email": null,
        "status": "0",
        "delFlag": null,
        "parentName": null,
        "children": []
      },
      "roles": [
        {
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "remark": null,
          "params": {
            "@type": "java.util.HashMap"
          },
          "roleId": 1,
          "roleName": "超级管理员",
          "roleKey": "admin",
          "roleSort": 1,
          "dataScope": "1",
          "menuCheckStrictly": false,
          "deptCheckStrictly": false,
          "status": "0",
          "delFlag": null,
          "flag": false,
          "menuIds": null,
          "deptIds": null,
          "permissions": null,
          "admin": true
        }
      ],
      "roleIds": null,
      "postIds": null,
      "roleId": null,
      "admin": true
    }
  }
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/api/captcha/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}