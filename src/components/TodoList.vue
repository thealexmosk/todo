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
      const xCompl = x.data.completed
      const yCompl = y.data.completed

      if (!xCompl && !yCompl) {
        return 0
      } else if (xCompl && !yCompl) {
        return 1
      } else if (yCompl && !xCompl) {
        return -1
      } else if (xCompl && yCompl) {
        const xTime = new Date(x.data.completedAt).getTime()
        const yTime = new Date(y.data.completedAt).getTime()

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
    todos: Array,
    parent: Object,
    filter: String,
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
      todoList: this.todos,
      isDraggable: true,
    }
  },
  computed: {
    filteredTodos() {
      const filter = this.filter || 'all'
      return todoFilters[filter](this.todoList)
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
