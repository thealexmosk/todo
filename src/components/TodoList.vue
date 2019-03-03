<template lang="html">
  <ul class="list">
    <draggable
      v-if="todos"
      v-model="todoList"
      :move="isMovable"
      :options="{draggable:'.todo--draggable', group:'todos'}"
      @input="$emit('input', $event)">
      <TodoItem
        v-for="(todo, index) in todos"
        :key="todo.id"
        :todo="todo"
        :class="`todo__num-${index}`"
        @draggableChange="$emit('draggableChange', $event)"/>
    </draggable>
  </ul>
</template>

<script>
import TodoItem from '@/components/TodoItem.vue'
import draggable from 'vuedraggable'

const todoFilters = {
  all(todos) {
    return [...todos].sort( (x, y) => {
      const xCompl = x.completed
      const yCompl = y.completed

      if (!xCompl && !yCompl) {
        return 0
      } else if (xCompl && !yCompl) {
        return 1
      } else if (yCompl && !xCompl) {
        return -1
      } else if (xCompl && yCompl) {
        const xTime = new Date(x.completedAt).getTime()
        const yTime = new Date(y.completedAt).getTime()

        return xTime == yTime ?
          0 :
            xTime < yTime ?
              1 :
              -1
        }
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
    parent: [Object, Number],
    todos: Array,
    filter: String,
  },
  components: {
    TodoItem,
    draggable
  },
  data() {
    return {
      isDraggable: true,
    }
  },
  computed: {
    filteredTodos() {
      const filter = this.filter || 'all'
      return todoFilters[filter](this.todoList)
    },
    todoList: {
      get() {
        return this.todos
      },
      set(value) {
        const arr = value.map( todo => todo.id);
        this.$store.dispatch('changeOrder', {arr: arr, parent: this.parent})
      }
    }
  },
  methods: {
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
