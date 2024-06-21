<template>
  <div class="app-container">
    <h4 class="form-header h4">基本信息</h4>
    
  </div>
</template>

<script>

export default {
  name: "AuthRole",
  data() {
    return {
       // 遮罩层
      loading: true,
      // 分页信息
      total: 0,
      pageNum: 1,
      pageSize: 10,
      // 选中角色编号
      roleIds:[],
      // 角色信息
      roles: [],
      // 用户信息
      form: {}
    };
  },
  
};
</script>