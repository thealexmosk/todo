<template lang="html">
  <div class="modal__wrapper" @mousedown="close" ref="modal">
      <div class="modal__container">
          <div class="modal__row modal__title"  v-if="editingField != 'title'">
            <div class="todo-btn__container">
              <h2 class="title">{{ currTodo.data.title }}</h2>
              <TodoButton type="edit" @click="editingField = 'title'"/>
            </div>
            <div class="" v-if="editingField == 'title'">
              <input type="text" v-model.trim="title">
              <button type="button" >Ok</button>
              <button type="button" >X</button>
            </div>
              <span>X</span>
          </div>
          <div class="modal__row">
              <TimeNeeded :timeNeeded="currTodo.data.timeNeeded" :extended="true"/>
              <DueDate :dueDate="currTodo.data.dueDate" :extended="true"/>
          </div>
          <div class="modal__row">
            <div class="todo-btn__container">
              <h3 class="title">Description</h3>
              <TodoButton type="edit"/>
            </div>
              {{ currTodo.data.description || 'Add a description' }}
          </div>
          <div class="modal__row">
              <h3 class="title">Child todos</h3>
              <ul v-if="currTodo.subTodos.length > 0">
                <li v-for="subTodo in currTodo.subTodos" :key="subTodo.id">
                  <div class="todo-btn__container">
                    <input type="checkbox" v-model="subTodo.data.completed">
                    <span @click="currTodo = subTodo">{{ subTodo.data.title }}</span>
                    <TodoButton type="edit"/>
                  </div>
                </li>
              </ul>
              <div v-else class="">
                Create new subTodos
              </div>
          </div>
          <div class="modal__row" v-if="currTodo.parent">
              <h3 class="title">Parent Todo</h3>
              <div class="" @click="currTodo = currTodo.parent">
                {{ currTodo.parent.data.title }}
              </div>
          </div>
          <div class="modal__row">
            <button type="button" name="button">Done</button>
          </div>
      </div>
  </div>
</template>

<script>
import DueDate from '@/components/DueDate.vue'
import TimeNeeded from '@/components/TimeNeeded.vue'
import TodoButton from '@/components/TodoButton.vue'
import Vue from 'vue'

export default {
  name: 'TodoModal',
  components: {
    DueDate,
    TimeNeeded,
    TodoButton
  },
  props: {
    todo: Object
  },
  data() {
    return {
      currTodo: this.todo,
      title: this.todo.data.title,
      editingField: '',
    }
  },
  computed: {
    filteredTodos() {
      return Vue.prototype.$todoFilters['all'](this.todo.subTodos)
    },
  },
  methods: {
    close(event) {
      if (event.target == this.$refs.modal) {
        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  .modal
    &__wrapper
      position: fixed
      z-index: 999
      top: 0
      left: 0
      width: 100%
      height: 100%
      display: flex
      align-items: center
      justify-content: center
      background-color: rgba(0, 0, 0, 0.5)
    &__container
      width: 80%
      max-width: 700px
      min-width: 250px
      padding: 30px
      text-align: left
      background-color: rgba(255, 255, 255, 1)
      border-radius: 10px
    &__row
      margin-bottom: 20px
    &__title
      display: flex
      justify-content: space-between
  .title
    display: inline-block
    margin: 0

</style>
