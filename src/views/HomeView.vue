<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <div :style="{ backgroundColor: variables.menuBackground }">12312331</div>
    <!-- {{ variables.menuBackground }} -->
    <p >Menu</p>
  </div>
</template>
<script>
// import HelloWorld from '@/components/HelloWorld.vue'
import variables from '@/assets/styles/variables.module.scss'
export default {
  name: 'HomeView',
  components: {
    // HelloWorld
  },
  data() {
    return {
      // menuLightColor: variables.menuLightColor,
      // menuBackground: variables.menuBackground
    }
  },
  computed: {
    variables(){
      return variables;
    }
  },  
  created(){
    console.log('variables2 :', variables);
    // console.log('menuBackground:', this.menuBackground);
    // console.log('menuLightColor:', this.menuLightColor);
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/variables.module.scss";
p {
  color: $menuBackground;
}
</style>