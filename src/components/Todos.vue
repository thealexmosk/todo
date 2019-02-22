<template lang="html">
  <div class="todo__list">
    <h3>TODO List</h3>
    <AddTodoInput @newTodo="addSubTodo"/>
    <TodoList v-model="todos" @openModal="openModal"/>
    <!-- <ul class="list">
      <draggable
        v-model="todos"
        :move="isMovable"
        :options="{draggable:'.todo--draggable', group:'todos'}">
        <TodoItem
          v-for="(todo, index) in filteredTodos"
          :key="todo.data.id"
          :todo="todo"
          :class="`todo__num-${index}`"
          @nodrag="cancelDraggable"
          @drag="allowDraggable"
          @confirmRemove="confirmRemoveTodo"
          @remove="removeTodo"
          @openModal="openModal"/>
      </draggable>
    </ul> -->
    <div class="todo__filters">
      <button type="button" @click="filter = 'all'">All</button>
      <button type="button" @click="filter = 'active'">Active</button>
      <button type="button" @click="filter = 'completed'">Completed</button>
    </div>
    <div class="todo__control" v-show="todos.length > 0">
      <button type="button" @click="saveTodoStorage">SAVE</button>
      <button type="button" @click="clearTodoStorage">CLEAR</button>
      <button type="button" @click="logTodos">TODOS</button>
    </div>
    <TodoModal
        :todo="modalTodo"
        :editField="editField"
        v-if="showModal"
        @close="closeModal"/>
  </div>
</template>

<script>
import TodoItem from '@/components/TodoItem.vue'
import TodoList from '@/components/TodoList.vue'
import AddTodoInput from '@/components/AddTodoInput.vue'
import TodoModal from '@/components/TodoModal.vue'
import draggable from 'vuedraggable'
import Vue from 'vue'

// Local Storage to save and get todos and idCounter
const todoStorage = {
  getTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [defaultTodo]
    return todos
  },
  getIdCounter() {
    return parseInt(localStorage.getItem('idCounter')) || 0
  },
  save(todos, idCounter) {
    localStorage.setItem('todos', todos)
    localStorage.setItem('idCounter', idCounter)
  },
  clear() {
    localStorage.clear();
  }
}

// Filters for main todo list (not nested)
Vue.prototype.$todoFilters = {
  all(todos) {
    return todos.sort( (x, y) => {
      return x.completed === y.completed ?
        0 :
        y.completed ?
          -1 :
          1
      })
  },
  active(todos) {
    return todos.filter( todo => !todo.completed)
  },
  completed(todos) {
    return todos.filter( todo => todo.completed)
  }
}

// Global class for creating new Todo objects
Vue.prototype.$Todo = class Todo {
  static idCounter = todoStorage.getIdCounter()

  constructor({
    title = '',
    description = '',
    completed = false,
    dueDate = null,
    timeNeeded = 0,
    completedAt = null
  } = {}) {
    this.data = {
      id: Todo.idCounter++,
      title: title,
      description: description,
      completed: completed,
      dueDate: dueDate,
      timeNeeded: timeNeeded,
      completedAt: completedAt,
      createdAt: new Date(),
    }
    this.subTodos = []
  }
}

// Default Todo
const defaultTodo = new Vue.prototype.$Todo({title: 'Default Todo'})

// Vue
export default {
  name: 'Todos',
  components: {
    TodoItem,
    AddTodoInput,
    TodoModal,
    TodoList,
    draggable,
  },
  data() {
    return {
      todos: todoStorage.getTodos(),
      filter: 'all',
      showModal: false,
      modalTodo: null,
      editField: '',
    }
  },
  computed: {
    filteredTodos() {
      return Vue.prototype.$todoFilters[this.filter](this.todos)
    },
  },
  methods: {
    saveTodoStorage() {
      const idCounter = this.$Todo.idCounter
      const todosForSave = JSON.stringify(this.todos, (key, val) => {
        return ['el','parent'].includes(key) ? undefined : val
      });

      todoStorage.save(todosForSave, idCounter)
    },
    clearTodoStorage() {
      if ( !confirm('Are you sure?'))
        return

      todoStorage.clear()
      this.todos = []
    },
    addSubTodo(todo) {
      this.todos.push(todo)
    },
    openModal(obj) {
      if (obj.editField) {
        this.modalTodo = obj.todo
        this.editField = obj.editField
      } else {
        this.modalTodo = obj
      }

      this.showModal = true
    },
    closeModal() {
      this.modalTodo = null
      this.editField = ''
      this.showModal = false
    },
    logTodos() {
      console.log('TODOS', this.todos)
    },
    isMovable(evt) {
      return (!evt.draggedContext.element.isEditing)
    },
    cancelDraggable() {
      this.isDraggable = false
    },
    allowDraggable() {
      this.isDraggable = true
    },
    confirmRemoveTodo(id) {
      if (!window.confirm('Are you sure?')) {
        return;
      }

      this.removeTodo(id)
    },
    removeTodo(id) {
      const todoId = this.todos.findIndex( el => el.id === id)

      this.todos.splice(todoId, 1)
    },
  }
}
</script>

<style lang="sass" scoped>
  .list
    text-align: left

</style>

<style lang="sass">

.time-field
  display: inline-block
  &--extended:not(:last-child)
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
