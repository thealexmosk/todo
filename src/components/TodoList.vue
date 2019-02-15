<template lang="html">
  <div class="todo__list">
    <h3>TODO List</h3>
    <div class="todo__add">
      <input placeholder="New To-Do"
        type="text"
        v-model.trim="newTitle">
      <input placeholder="Time"
        type="number"
        v-model="newTime">
      <button type="button" @click="addTodo">Add</button>
    </div>
    <div class="todo__filters">
      <button type="button" @click="filter = 'all'">All</button>
      <button type="button" @click="filter = 'active'">Active</button>
      <button type="button" @click="filter = 'completed'">Completed</button>
    </div>
    <ul class="list">
      <draggable
        v-model="todos"
        :move="isMovable"
        :options="{draggable:'.todo--draggable', group:'todos'}">
        <ToDo
          v-for="(todo, index) in filteredTodos"
          :key="todo.id"
          :todo="todo"
          :idCounter="idCounter"
          :class="`todo__num-${index}`"
          @incId="incId"
          @nodrag="cancelDraggable"
          @drag="allowDraggable"
          @confirmRemove="confirmRemoveTodo"
          @remove="removeTodo"
          />
      </draggable>
    </ul>
    <div class="todo__control" v-show="todos.length > 0">
      <button type="button" @click="saveTodoStorage">SAVE</button>
      <button type="button" @click="clearTodoStorage">CLEAR</button>
      <button type="button" @click="logTodos">TODOS</button>
    </div>
  </div>
</template>

<script>
import ToDo from '@/components/ToDo.vue'
import draggable from 'vuedraggable'

const defTodo = {
  id: 0,
  title: 'Tosdos',
  time: 0,
  completed: false,
  subTodos: [],
}
const todoStorage = {
  getTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [defTodo]
    return todos
  },
  getIdCounter() {
    return parseInt(localStorage.getItem('idCounter')) || 0
  },
  save(todos, idCounter) {
    localStorage.setItem('todos', JSON.stringify(todos))
    localStorage.setItem('idCounter', idCounter)
  },
  clear() {
    localStorage.clear();
  }
}
const filters = {
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

export default {
  components: {
    ToDo,
    draggable
  },
  data() {
    return {
      todos: todoStorage.getTodos(),
      idCounter: todoStorage.getIdCounter(),
      newTitle: '',
      newTime: '',
      filter: 'all',
    }
  },
  computed: {
    filteredTodos() {
      return filters[this.filter](this.todos)
    },
  },
  methods: {
    saveTodoStorage() {
      const todosForSave = copyTodosForSave(this.todos)
      const idCounter = this.idCounter

      todoStorage.save(todosForSave, idCounter)

      function copyTodosForSave(ob) {
        const todos = []

        if (Array.isArray(ob) && ob.length !== 0) {
          ob.forEach( el => {
            todos.push( copyTodosForSave(el) )
          })
        } else if (typeof ob === 'object' && ob.constructor === Object) {
          const {el, isEditing, ...saveTodo} = ob;
          saveTodo.subTodos = copyTodosForSave(ob.subTodos)
          return saveTodo
        }

        return todos
      }
    },
    clearTodoStorage() {
      if ( !confirm('Are you sure?'))
        return

      todoStorage.clear()
      this.todos = []
    },
    incId() {
      this.idCounter++
    },
    addTodo() {
      const title = this.newTitle;
      const timeVal = parseFloat(this.newTime);
      const time = !isNaN(timeVal) ? timeVal : 0 ;

      const newTodo = {
        id: this.newId(),
        title: title,
        time: time,
        completed: false,
        isEditing: true,
        subTodos: [],
      };

      this.todos.push(newTodo)
    },
    logTodos() {
      console.log('TODOS', this.todos)
    },
    newId() {
      this.incId()
      return this.idCounter
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
