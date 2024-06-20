<template>
  <div class="hello">
    <div v-for="item in type" :key="item.id">
      {{ item }}
      <br>
    </div>
    <button @click="getIllnessTypeList">获取疾病类型</button>
  </div>
</template>

<script>
import {
  illnessTypeList
} from '@/api/test.js'
export default {
  name: 'HelloWorld',
  data() {
    return {
      illnessTypeList: [],
      type:[]
    }
  },
  created() {
  },
  methods: {
    async getIllnessTypeList() {
      await illnessTypeList().then(response => {
        console.log(response.data)
        this.type = response.data
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
