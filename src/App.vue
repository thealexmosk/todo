<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <TodoList @openModal="openModal"/>
    <TodoModal
        :todo="modalTodo"
        v-if="showModal"
        @close="closeModal"/>
  </div>
</template>

<script>
import TodoList from './components/TodoList.vue'
import TodoModal from './components/TodoModal.vue'

export default {
  name: 'app',
  components: {
    TodoList,
    TodoModal
  },
  data() {
    return {
      showModal: false,
      modalTodo: null
    }
  },
  methods: {
    openModal(todo) {
      this.modalTodo = todo
      this.showModal = true
    },
    closeModal() {
      this.modalTodo = null
      this.showModal = false
    }
  }
}
</script>

<style lang="sass">
*
  box-sizing: border-box

#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  margin-top: 60px

.time-field
  display: inline-block
  &:not(:last-child)
    margin-right: 20px
  &__label
    text-align: left
    font-size: 13px
    margin-bottom: 5px
  &__val
    display: inline-block
    padding: 5px 10px
    color: rgba(255, 255, 255, 0.9)
    border-radius: 5px

</style>
