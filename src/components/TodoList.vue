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
        :parent="parent"
        :class="`todo__num-${index}`"
        :isNested="isNested"
        @draggableChange="$emit('draggableChange')"
        @confirmRemove="confirmRemoveTodo"
        @completedChange="$emit('completedChange')"
        @remove="removeTodo"
        @openModal="$emit('openModal', $event)"
        @changeTodo="$emit('changeTodo', $event)"/>
    </draggable>
  </ul>
</template>

<script>
import TodoItem from '@/components/TodoItem.vue'
import draggable from 'vuedraggable'

const todoFilters = {
  all(todos) {
    return [...todos].sort( (x, y) => {
      const xCompletedAt = x.data.completedAt
      const yCompletedAt = y.data.completedAt

      if (!xCompletedAt && !yCompletedAt) {
        return 0
      } else if (xCompletedAt && !yCompletedAt) {
        return 1
      } else if (yCompletedAt && !xCompletedAt) {
        return -1
      } else if (xCompletedAt && yCompletedAt) {
        const xTime = new Date(xCompletedAt).getTime()
        const yTime = new Date(yCompletedAt).getTime()

        return xTime == yTime ?
          0 :
            xTime < yTime ?
              1 :
              -1
        }
      })
  },
  active(todos) {
    return todos.filter( todo => !todo.data.completed)
  },
  completed(todos) {
    return todos.filter( todo => todo.data.completed)
  }
}

export default {
  name: 'TodoList',
  props: {
    value: Array,
    parent: Object,
    isNested: {
      type: Boolean,
      default: true
    },
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
      const todoId = this.todoList.findIndex( el => el.data.id === id)

      this.todoList.splice(todoId, 1)
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
