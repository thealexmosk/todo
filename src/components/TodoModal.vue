<template lang="html">
  <transition name="fade">
    <div class="modal__wrapper" @mousedown="close" ref="modal">
        <div class="modal__container">
            <div class="modal__row modal__title">
              <div class="todo-btn__container" v-if="!isEditing || editingField != 'title'">
                <h2 class="title">{{ todo.title }}</h2>
                <TodoButton type="edit" @click.native="isEditing = 'title'"/>
              </div>
              <EditTodo
                :prop="todo.title"
                :input='editingField'
                :todoId="todo.id"
                v-if="isEditing && editingField == 'title'"/>
              <span @click="$store.commit('CLOSE_MODAL')">X</span>
            </div>
            <div class="modal__row">
              <input type="checkbox" v-model="todo.completed">
              <span v-if="todo.completed">Completed ({{ completedDate }})</span>
              <span v-else>In progress</span>
            </div>
            <div class="modal__row">
                <TimeNeeded v-model="todo.timeNeeded" :extended="true"/>
                <DueDate v-model="todo.dueDate" :extended="true"/>
            </div>
            <div class="modal__row">
              <div class="todo-btn__container">
                <h3 class="title">Description</h3>
                <TodoButton type="edit" v-if="!isEditing || editingField != 'description'"  @click.native="isEditing = 'description'"/>
              </div>
              <div v-if="!isEditing || editingField != 'description'">
                {{ todo.description || 'Add a description' }}
              </div>
              <EditTodo
                :prop="todo.description"
                :input='editingField'
                :todoId="todo.id"
                v-if="isEditing && editingField == 'description'"/>
            </div>
            <div class="modal__row">
                <h3 class="title">Child todos</h3>
                <TodoList
                  v-if="true"
                  :todos="$store.getters.subTodos(todo.id)"
                  :nested="false"/>
                <div v-else>
                  Create new subTodos
                </div>
                <AddTodoInput @newTodo="addSubTodo"/>
            </div>
            <div class="modal__row" v-if="todo.parentTodo !== null">
                <h3 class="title">Parent Todo</h3>
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
    editResult(res, val) {
      if (res == 'store') {
        this.currTodo.data[this.editingField] = val
      }

      this.editingField = null
    },
    close(event) {
      if (event.target == this.$refs.modal) {
        this.$store.commit('CLOSE_MODAL')
      }
    },
    addSubTodo(todo) {
      this.currTodo.subTodos.push(todo)
    },
  },
  mounted() {
    if (this.editField) {
      this.editingField = this.editField
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
</style>
