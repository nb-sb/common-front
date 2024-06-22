<template>
  <div class="home">
    这里是首页
    
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