<template>
  <div id="app">
    <Todos />
  </div>
</template>

<script>
import Todos from './components/Todos.vue'

export default {
  name: 'app',
  components: {
    Todos,
  }
}
</script>

<style lang="sass">
@import 'src/assets/sass/main'

#app
  height: 100%
</style>
