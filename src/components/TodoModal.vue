<template lang="html">
  <transition name="fade">
    <div class="modal__wrapper" @mousedown="close" ref="modal">
        <div class="modal__container">
            <div class="modal__row modal__main">
              <div class="modal__title">
                <div class="todo-btn__container" v-if="!isEditing || editingField != 'title'">
                  <h2 class="title modal__field-name"
                    @dblclick="isEditing = 'title'">
                    {{ todo.title }}
                  </h2>
                  <div class="modal-btn btn">
                    <svg class="icon icon-edit btn__icon"
                      @click="isEditing = 'title'">
                      <use xlink:href="#edit"/>
                    </svg>
                  </div>
                  <!-- <TodoButton type="edit" @click.native="isEditing = 'title'"/> -->
                </div>
                <EditTodo
                  :prop="todo.title"
                  :input='editingField'
                  :todoId="todo.id"
                  v-if="isEditing && editingField == 'title'"/>
              </div>
              <div class="modal__close modal-btn btn" @click="$store.commit('CLOSE_MODAL')">
                <svg class="icon icon-close btn__icon">
                  <use xlink:href="#cross"/>
                </svg>
              </div>
            </div>
            <div class="modal__row">
              <input type="checkbox" v-model="todo.completed" @change="completeChange">
              <span v-if="todo.completed">Completed ({{ completedDate }})</span>
              <span v-else>In progress</span>
            </div>
            <div class="modal__row">
                <TimeNeeded v-model="todo.timeNeeded" :extended="true" @input="timeChange"/>
                <DueDate v-model="todo.dueDate" :extended="true" @input="dueChange"/>
            </div>
            <div class="modal__row">
              <div class="todo-btn__container">
                <h3 class="modal__field-name">Description</h3>
                <div class="modal-btn btn"
                  v-if="!isEditing || editingField != 'description'"
                  @click="isEditing = 'description'">
                  <svg class="icon icon-edit btn__icon">
                    <use xlink:href="#edit"/>
                  </svg>
                </div>
              </div>
              <div class="description" v-if="!isEditing || editingField != 'description'">
                {{ todo.description || 'Add a description' }}
              </div>
              <EditTodo
                :prop="todo.description"
                :input='editingField'
                :todoId="todo.id"
                v-if="isEditing && editingField == 'description'"/>
            </div>
            <div class="modal__row">
                <h3 class="modal__field-name">Child todos</h3>
                <TodoList
                  v-if="true"
                  :todos="$store.getters.subTodos(todo.id)"
                  :nested="false"/>
                <div v-else>
                  Create new subTodos
                </div>
                <AddTodoInput :parent="todo.id"/>
            </div>
            <div class="modal__row" v-if="todo.parentTodo !== null">
                <h3 class="modal__field-name">Parent Todo</h3>
                <div class="todo-btn__container">
                  <TodoItem
                    :todo="$store.getters.todoParent(todo.id)"
                    :nested="false"/>
                </div>
            </div>
        </div>
    </div>
  </transition>
</template>

<script>
import DueDate from '@/components/DueDate.vue'
import TodoList from '@/components/TodoList.vue'
import TodoItem from '@/components/TodoItem.vue'
import TimeNeeded from '@/components/TimeNeeded.vue'
import TodoButton from '@/components/TodoButton.vue'
import EditTodo from '@/components/EditTodo.vue'
import AddTodoInput from '@/components/AddTodoInput.vue'
import { DateTime } from 'luxon'
import Vue from 'vue'

import edit from '@/assets/icons/svg/edit.svg'
import close from '@/assets/icons/svg/cross.svg'

export default {
  name: 'TodoModal',
  components: {
    DueDate,
    TimeNeeded,
    TodoButton,
    EditTodo,
    TodoList,
    TodoItem,
    AddTodoInput
  },
  props: {
    todo: Object,
    editField: String
  },
  data() {
    return {
      currTodo: this.todo,
      editingField: '',
    }
  },
  computed: {
    isEditing: {
      get() {
        const isEditing = this.$store.state.editingTodo == this.todo.id
          && this.$store.state.modalTodo === this.todo.id;
        return isEditing
      },
      set(val) {
        this.$store.dispatch('setEditing', this.todo.id)
        this.editingField = val;
      }
    },
    filteredTodos() {
      return Vue.prototype.$todoFilters['all'](this.todo.subTodos)
    },
    completedDate() {
      const date = DateTime.fromJSDate(this.todo.completedAt).toLocaleString()
      return date
    }
  },
  methods: {
    close(event) {
      if (event.target == this.$refs.modal) {
        this.$store.commit('CLOSE_MODAL')
      }
    },
    timeChange(val) {
      this.$store.commit('SET_TIME_NEEDED', {id: this.todo.id, timeNeeded: val})
    },
    dueChange(val) {
      this.$store.commit('SET_DUE_DATE', {id: this.todo.id, dueDate: val})
    },
    completeChange() {
      this.$store.dispatch('completeTodo', {id: this.todo.id, complete: this.todo.completed})
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
      max-height: 80%
      padding: 30px
      text-align: left
      background: linear-gradient(rgb(232, 232, 241), rgb(200, 208, 231))
      border-radius: 10px
      overflow: hidden
    &__row
      margin-bottom: 20px
    &__main
      height: 40px
      display: flex
      justify-content: space-between
      align-items: center
    &__title
      overflow: hidden
      width: 100%
    &__field-name
      display: inline-block
      margin: 0 5px 5px 0

  .title
    max-width: 90%
    text-overflow: ellipsis
    overflow: hidden
    white-space: nowrap

  .icon-close
    width: 25px
    height: 25px
</style>
