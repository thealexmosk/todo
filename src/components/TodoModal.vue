<template lang="html">
  <transition name="fade">
    <div class="modal__wrapper" @mousedown="close" ref="modal">
        <div class="modal__container">
            <div class="modal__row modal__title">
              <div class="todo-btn__container" v-if="editingField != 'title'">
                <h2 class="title">{{ currTodo.data.title }}</h2>
                <TodoButton type="edit" @click.native="editingField = 'title'"/>
              </div>
              <EditTodo :prop="currTodo.data.title" :input='editingField' v-if="editingField == 'title'" @editResult="editResult"/>
              <span @click="$emit('close')">X</span>
            </div>
            <div class="modal__row">
              <input type="checkbox" v-model="currTodo.data.completed"  @change="currTodo.el.onCompletedChange">
              <span v-if="currTodo.data.completed">Completed ({{ completedDate }})</span>
              <span v-else>In progress</span>
            </div>
            <div class="modal__row">
                <TimeNeeded v-model="currTodo.data.timeNeeded" :extended="true"/>
                <DueDate v-model="currTodo.data.dueDate" :extended="true"/>
            </div>
            <div class="modal__row">
              <div class="todo-btn__container">
                <h3 class="title">Description</h3>
                <TodoButton type="edit" v-if="editingField != 'description'"  @click.native="editingField = 'description'"/>
              </div>
              <div v-if="editingField != 'description'">
                {{ currTodo.data.description || 'Add a description' }}
              </div>
              <EditTodo :prop="currTodo.data.description" :input='editingField' type="description" v-if="editingField == 'description'" @editResult="editResult"/>
            </div>
            <div class="modal__row">
                <h3 class="title">Child todos</h3>
                <TodoList
                  v-if="currTodo.el.hasSubTodosComputed"
                  v-model="currTodo.subTodos"
                  @completedChange="currTodo.el.checkCompleted"
                  @draggableChange="currTodo.el.changeDraggable"
                  @changeTodo="val => currTodo = val"
                  :isNested="false"/>
                <div v-else>
                  Create new subTodos
                </div>
            </div>
            <div class="modal__row" v-if="currTodo.parent">
                <h3 class="title">Parent Todo</h3>
                <div class="todo-btn__container">
                  <TodoItem
                    :todo="currTodo.parent"
                    :isNested="false"
                    @changeTodo="val => currTodo = val"/>
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
    TodoItem
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
    filteredTodos() {
      return Vue.prototype.$todoFilters['all'](this.todo.subTodos)
    },
    completedDate() {
      const date = DateTime.fromJSDate(this.currTodo.data.completedAt).toLocaleString()
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
        this.$emit('close')
      }
    }
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
