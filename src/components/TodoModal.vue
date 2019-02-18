<template lang="html">
  <div class="modal__wrapper" @mousedown="close" ref="modal">
      <div class="modal__container">
          <div class="modal__row modal__title">
            <div class="todo-btn__container">
              <h2 class="title">{{ todo.data.title }}</h2>
              <TodoButton type="edit"/>
            </div>
              <span>X</span>
          </div>
          <div class="modal__row">
              <TimeNeeded :timeNeeded="todo.data.timeNeeded" :extended="true"/>
              <DueDate :dueDate="todo.data.dueDate" :extended="true"/>
          </div>
          <div class="modal__row">
            <div class="todo-btn__container">
              <h3 class="title">Description</h3>
              <TodoButton type="edit"/>
            </div>
              {{ todo.data.description || 'Add a description' }}
          </div>
          <div class="modal__row">
              <h3>Child todos</h3>
              <ul>
                <li v-for="subTosdo in todo.subTodos" :key="subTosdo.id">
                  <div class="todo-btn__container">
                    <span>{{ subTosdo.data.title }}</span>
                    <TodoButton type="edit"/>
                  </div>
                </li>
              </ul>
          </div>
          <div class="modal__row" v-if="todo.parent">
              <h3>Parent Todo</h3>
              {{ todo.parent.data.title }}
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
      yo: null
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
