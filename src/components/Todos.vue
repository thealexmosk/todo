<template lang="html">
  <div class="todo__list">
    <h3>TODO List</h3>
    <AddTodoInput/>
    <TodoList :todos="$store.getters.todoList" :filter="filter"/>
    <div class="todo__filters">
      <button type="button" @click="filter = 'all'">All</button>
      <button type="button" @click="filter = 'active'">Active</button>
      <button type="button" @click="filter = 'completed'">Completed</button>
    </div>
    <div class="todo__control">
      <button type="button" @click="localClear">CLEAR</button>
    </div>
    <TodoModal :todo="modalTodo" v-if="showModal"/>
  </div>
</template>

<script>
import TodoList from '@/components/TodoList.vue'
import AddTodoInput from '@/components/AddTodoInput.vue'
import TodoModal from '@/components/TodoModal.vue'
import Vue from 'vue'

Vue.prototype.$todoFilters = {
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

// Vue
export default {
  name: 'Todos',
  components: {
    AddTodoInput,
    TodoModal,
    TodoList,
  },
  data() {
    return {
      filter: 'all'
    }
  },
  computed: {
    showModal() {
      return this.$store.state.modalTodo !== null;
    },
    modalTodo() {
      return this.$store.state.todos[this.$store.state.modalTodo];
    }
  },
  methods: {
    localClear() {
      this.$store.commit('REMOVE_ALL');
      localStorage.clear();
    },
    logTodos() {
      console.log('TODOS', this.todos);
    },
    isMovable(evt) {
      return (!evt.draggedContext.element.isEditing);
    },
    cancelDraggable() {
      this.isDraggable = false;
    },
    allowDraggable() {
      this.isDraggable = true;
    },
    confirmRemoveTodo(id) {
      if (!window.confirm('Are you sure?')) {
        return;
      }

      this.removeTodo(id);
    },
    removeTodo(id) {
      const todoId = this.todos.findIndex( el => el.id === id);

      this.todos.splice(todoId, 1);
    },
  }
}
</script>

<style lang="sass" scoped>
  .list
    text-align: left

  .todo
    &__filters
      margin-bottom: 10px

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
