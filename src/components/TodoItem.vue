<template lang="html">
  <li class="todo"
    :class="{'todo--draggable': isDraggable, 'todo--completed': todo.completed}">
      <input type="checkbox" v-model="todo.completed" @change="completeChange">
      <div class="normal" v-if="!isEditing">
          <button
            type="button"
            @click="showSubTodos = !showSubTodos"
            v-if="hasSubTodosComputed">
                {{ showSubTodos ? '-' : '+' }}
          </button>
          <label>{{ `${todo.title}` }}</label>
          <!-- <TimeNeeded v-if="todo.timeNeeded > 0" v-model="todo.timeNeeded" @open="value => isDraggable = !value"/>
          <DueDate v-if="todo.dueDate" v-model="todo.dueDate" @open="value => isDraggable = !value"/> -->
          <button type="button" @click="addTodo">Add</button>
          <button type="button" @click="$store.dispatch('setEditing', todo.id)">Edit</button>
          <button type="button" >More</button>
          <button type="button" @click="confirmRemove">X</button>
      </div>
      <EditTodo
        v-if="$store.state.editingTodo == todo.id"
        input="title"
        :todoId="todo.id"
        :prop="todo.title"
        @click="$store.setEditing(todo.id)">
          <button type="button">More</button>
      </EditTodo>
      <TodoList
        v-show="showSubTodos"
        :parent="todo.id"
        :todos="$store.getters.subTodos(todo.id)"
        @draggableChange="changeDraggable"/>
  </li>
</template>

<script>
import TodoList from '@/components/TodoList.vue'
import EditTodo from '@/components/EditTodo.vue'
// import TimeNeeded from '@/components/TimeNeeded.vue'
// import DueDate from '@/components/DueDate.vue'

export default {
  name: 'TodoItem',
  components: {
    EditTodo,
    TodoList
    // TimeNeeded,
    // DueDate,
  },
  props: {
    todo: Object
  },
  data() {
    return {
      isDraggable: !(this.$store.state.editingTodo == this.todo.id),
      showSubTodos: !this.todo.completed,
    }
  },
  computed: {
    isEditing() {
      return this.$store.state.editingTodo == this.todo.id
    },
    subTodos() {
      return this.$store.getters.subTodos(this.todo.id);
    },
    hasSubTodosComputed() {
      return this.todo.subTodos.length > 0;
    },
    time() {
      if ( !this.hasSubTodos() ) {
        return this.todo.timeNeeded;
      }

      const hasTime = this.todo.subTodos.every( todo => !isNaN(todo.timeNeeded) && todo.timeNeeded>0);

      if (!hasTime)
        return '';

      return this.todo.subTodos.reduce( (acc, todo) => acc + parseFloat(todo.timeNeeded), 0);
    }
  },
  watch: {
    isEditing(val) {
      this.changeDraggable(!val);
    }
  },
  methods: {
    changeDraggable(val) {
      this.isDraggable = val;
      this.$emit('draggableChange', val);
    },
    completeChange() {
      this.$store.dispatch('completeTodo', {id: this.todo.id, complete: this.todo.completed})
    },
    addTodo() {
      this.$store.dispatch('addTodo', {title: '', parentTodo: this.todo.id});
    },
    confirmRemove() {
      if (!window.confirm('Are you sure?')) return;

      this.$store.dispatch('removeTodo', this.todo.id)
    }
  },
  beforeCreate: function () {
    this.$options.components.TodoList = require('@/components/TodoList.vue').default;
  }
}
</script>

<style lang="sass" scoped>
  .normal
    display: inline-block
  .edit
    display: inline-block
</style>
