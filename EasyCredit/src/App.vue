<template>
  <div id="app">
    <transition name="page" mode="out-in">
      <router-view/>
    </transition>
   
    <!-- <router-link v-bind:to="'/'">Iniciar sesión</router-link> -->
    <!-- <router-link v-bind:to="'/Inicio'" tag="submit">Inicio</router-link> -->
    <!-- <router-link v-bind:to="'/Perfil'">Perfil</router-link> -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.page-enter-active, .page-leave-active {
  transition: opacity 1s, transform 1s;
}
.page-enter, .page-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}
</style>
