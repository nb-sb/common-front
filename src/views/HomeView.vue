<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    hihi
    <br>
    {{ sss }}
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  data(){
    return {
      sss:0,
      username: "!23"
    }
  },
  created(){
    this.sss = this.$store.state.count
  }
}
</script>
