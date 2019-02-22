<template lang="html">
  <ul class="list">
    <draggable
      v-model="todoList"
      :move="isMovable"
      :options="{draggable:'.todo--draggable', group:'todos'}"
      @input="$emit('input', $event)">
      <TodoItem
        v-for="(todo, index) in filteredTodos"
        :key="todo.data.id"
        :todo="todo"
        :class="`todo__num-${index}`"
        @draggableChange="$emit('draggableChange')"
        @confirmRemove="confirmRemoveTodo"
        @completedChange="$emit('completedChange')"
        @remove="removeTodo"
        @openModal="$emit('openModal', $event)"/>
    </draggable>
  </ul>
</template>

<script>
import TodoItem from '@/components/TodoItem.vue'
import draggable from 'vuedraggable'

const todoFilters = {
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
  name: 'TodoList',
  props: {
    value: Array
  },
  components: {
    TodoItem,
    draggable
  },
  data() {
    return {
      todoList: this.value,
      isDraggable: true
    }
  },
  computed: {
    filteredTodos() {
      return todoFilters['all'](this.todoList)
    },
  },
  methods: {
    confirmRemoveTodo(id) {
      if (!window.confirm('Are you sure?')) {
        return;
      }

      this.removeTodo(id)
    },
    removeTodo(id) {
      const todoId = this.todo.subTodos.findIndex( el => el.data.id === id)

      this.todos.splice(todoId, 1)
    },
    isMovable(evt) {
      return (!evt.draggedContext.element.isDraggable)
    },
  },
  beforeCreate: function () {
    this.$options.components.TodoItem = require('@/components/TodoItem.vue').default
  }
}
</script>

<style lang="css" scoped>
</style>
