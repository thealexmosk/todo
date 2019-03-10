<template lang="html">
  <ul>
    <draggable
      v-if="todos"
      v-model="todoList"
      :move="isMovable"
      :options="{draggable:'.todo--draggable', group:'todos'}"
      @input="$emit('input', $event)"
      style="min-height: 5px">
      <TodoItem
        v-for="(todo, index) in todoList"
        :key="todo.id"
        :todo="todo"
        :nested="nested"
        :class="[{'todo--main' : parent === undefined}, `todo__num-${index}`]"
        @draggableChange="$emit('draggableChange', $event)"/>
    </draggable>
  </ul>
</template>

<script>
import TodoItem from '@/components/TodoItem.vue'
import draggable from 'vuedraggable'

export default {
  name: 'TodoList',
  props: {
    parent: [Object, Number],
    todos: Array,
    nested: {
      type: Boolean,
      default: true
    },
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
    todoList: {
      get() {
        const filter = this.filter || 'all';
        return this.$todoFilters[filter](this.todos);
      },
      set(value) {
        const arr = value.map( todo => todo.id);
        this.$store.dispatch('changeOrder', {arr: arr, parent: this.parent});
      }
    }
  },
  methods: {
    isMovable(evt) {
      return (!evt.draggedContext.element.isDraggable);
    },
  },
  beforeCreate: function () {
    this.$options.components.TodoItem = require('@/components/TodoItem.vue').default;
  }
}
</script>

<style lang="sass" scoped>
</style>
