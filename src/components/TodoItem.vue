<template lang="html">
  <li class="todo"
    :class="{'todo--draggable': isDraggable, 'todo--completed': todo.completed}">
      <div class="todo__item">
        <input type="checkbox" v-model="todo.completed" @change="completeChange">
        <div class="normal" v-if="!isEditing">
            <button
              type="button"
              @click="showSubTodos = !showSubTodos"
              v-if="nested && hasSubTodosComputed">
                  {{ showSubTodos ? '-' : '+' }}
            </button>
            <label>{{ `${todo.title}` }}</label>
            <TimeNeeded v-if="todo.timeNeeded > 0" v-model="todo.timeNeeded" @input="timeChange"  @open="value => isDraggable = !value"/>
            <DueDate v-if="todo.dueDate" v-model="todo.dueDate" @input="dueChange"  @open="value => isDraggable = !value"/>
            <button type="button" @click="addTodo" v-if="nested">Add</button>
            <button type="button" @click="$store.dispatch('setEditing', todo.id)">Edit</button>
            <button type="button" @click="$store.commit('OPEN_MODAL', todo.id)">More</button>
            <button type="button" @click="confirmRemove">X</button>
        </div>
        <EditTodo
          v-if="isEditing"
          input="title"
          :todoId="todo.id"
          :prop="todo.title">
            <button type="button">More</button>
        </EditTodo>
      </div>
      <TodoList
        v-show="nested && showSubTodos"
        :parent="todo.id"
        :nested="nested"
        :todos="$store.getters.subTodos(todo.id)"
        @draggableChange="changeDraggable"/>
  </li>
</template>

<script>
import TodoList from '@/components/TodoList.vue'
import EditTodo from '@/components/EditTodo.vue'
import TimeNeeded from '@/components/TimeNeeded.vue'
import DueDate from '@/components/DueDate.vue'

export default {
  name: 'TodoItem',
  components: {
    EditTodo,
    TodoList,
    TimeNeeded,
    DueDate,
  },
  props: {
    todo: Object,
    nested: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      isDraggable: !(this.$store.state.editingTodo == this.todo.id),
      showSubTodos: !this.todo.completed,
    }
  },
  computed: {
    isEditing() {
      const isEditingTodo = this.$store.state.editingTodo === this.todo.id;

      if (this.nested) {
        return isEditingTodo && this.$store.state.modalTodo === null
      }

      return isEditingTodo && this.$store.state.modalTodo !== this.todo.id
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
      this.$store.dispatch('completeTodo', {id: this.todo.id, complete: this.todo.completed});
    },
    addTodo() {
      this.$store.dispatch('createTodo', {title: '', parentTodo: this.todo.id, edit: true});
    },
    timeChange(val) {
      this.$store.commit('SET_TIME_NEEDED', {id: this.todo.id, timeNeeded: val})
    },
    dueChange(val) {
      this.$store.commit('SET_DUE_DATE', {id: this.todo.id, dueDate: val})
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
  .todo
    font-weight: normal
    color: rgb(62, 64, 103)
    &__item
      display: inline-block
      padding: 10px 15px
      background-color: rgb(221, 223, 241)
      border-radius: 8px
      margin-bottom: 10px
    &--main
      font-weight: bold

  .normal
    display: inline-block
  .edit
    display: inline-block
</style>
