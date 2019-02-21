<template lang="html">
  <transition name="fade">
    <div class="modal__wrapper" @mousedown="close" ref="modal">
        <div class="modal__container">
            <div class="modal__row modal__title">
              <div class="todo-btn__container" v-if="editingField != 'title'">
                <h2 class="title">{{ currTodo.data.title }}</h2>
                <TodoButton type="edit" @click.native="editingField = 'title'"/>
              </div>
              <EditTodo :prop="currTodo.data.title" v-if="editingField == 'title'"/>
              <span @click="$emit('close')">X</span>
            </div>
            <div class="modal__row">
              <input type="checkbox" v-model="currTodo.data.completed"  @change="currTodo.el.onCompletedChange">
                {{ currTodo.data.completed ? 'Completed' : 'In progress' }}
            </div>
            <div class="modal__row">
                <TimeNeeded v-model="currTodo.data.timeNeeded" :extended="true"/>
                <DueDate v-model="currTodo.data.dueDate" :extended="true"/>
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
                      <input type="checkbox" v-model="subTodo.data.completed" @change="subTodo.el.onCompletedChange">
                      <span @dblclick="currTodo = subTodo">{{ subTodo.data.title }}</span>
                      <TodoButton type="edit" @click.native="currTodo = subTodo"/>
                    </div>
                  </li>
                </ul>
                <div v-else class="">
                  Create new subTodos
                </div>
            </div>
            <div class="modal__row" v-if="currTodo.parent">
                <h3 class="title">Parent Todo</h3>
                <div class="todo-btn__container">
                  <div class="" @dblclick="currTodo = currTodo.parent">
                    {{ currTodo.parent.data.title }}
                  </div>
                  <TodoButton type="edit" @click.native="currTodo = currTodo.parent"/>
                </div>
            </div>
        </div>
    </div>
  </transition>
</template>

<script>
import DueDate from '@/components/DueDate.vue'
import TimeNeeded from '@/components/TimeNeeded.vue'
import TodoButton from '@/components/TodoButton.vue'
import EditTodo from '@/components/EditTodo.vue'
import Vue from 'vue'

export default {
  name: 'TodoModal',
  components: {
    DueDate,
    TimeNeeded,
    TodoButton,
    EditTodo,
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
      z-index: 99
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


  // Public
  .fade-enter-active, .fade-leave-active
    transition: opacity .5s

  .fade-enter, .fade-leave-to
    opacity: 0
</style>
