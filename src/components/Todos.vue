<template lang="html">
  <div class="todo__list">
    <h3>TODO List</h3>
    <AddTodoInput/>
    <div class="">
      <div v-for="todo in $store.state.todos">
        {{ todo }}
      </div>
    </div>
    <TodoList :todos="$store.getters.todoList" :filter="filter"/>
    <!-- <div class="todo__filters">
      <button type="button" @click="filter = 'all'">All</button>
      <button type="button" @click="filter = 'active'">Active</button>
      <button type="button" @click="filter = 'completed'">Completed</button>
    </div> -->
    <div class="todo__control">
      <!-- <button type="button" @click="saveTodoStorage">SAVE</button> -->
      <button type="button" @click="localClear">CLEAR</button>
      <!-- <button type="button" @click="logTodos">TODOS</button> -->
    </div>
    <TodoModal :todo="modalTodo" v-if="showModal"/>
  </div>
</template>

<script>
import TodoList from '@/components/TodoList.vue'
import AddTodoInput from '@/components/AddTodoInput.vue'
import TodoModal from '@/components/TodoModal.vue'
import Vue from 'vue'

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
      // todos: todoStorage.getTodos(),
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
    // openModal(obj) {
    //   if (obj.editField) {
    //     this.modalTodo = obj.todo;
    //     this.editField = obj.editField;
    //   } else {
    //     this.modalTodo = obj;
    //   }
    //
    //   this.showModal = true;
    // },
    // closeModal() {
    //   this.modalTodo = null;
    //   this.editField = '';
    //   this.showModal = false;
    // },
    localClear() {
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
