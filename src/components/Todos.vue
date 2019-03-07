<template lang="html">
  <div class="todos">
    <div class="todos__block todos__intro">
      <h1 class="title">
        <div class="title__pre">
          An awesome
        </div>
        <div class="title__main">
          Task Manager
        </div>
      </h1>
      <AddTodoInput class="add-todo"/>
    </div>
    <div class="todos__block todos__main">
      <div class="todos__list">
        <div class="list__wrapper">
          <div class="list">
            <TodoList :todos="$store.getters.todoList" :filter="filter"/>
          </div>
        </div>
        <div class="controls">
          <div class="controls__container">
            <div class="filters">
              <button type="button" @click="filter = 'all'">All</button>
              <button type="button" @click="filter = 'active'">Active</button>
              <button type="button" @click="filter = 'completed'">Completed</button>
            </div>
            <div class="clear">
              <div class="clear__button" @click="localClear">Clear all</div>
            </div>
          </div>
        </div>
      </div>
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
      if (!confirm('Are you sure?')) return

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
  .todos
    width: 100%
    height: 100%
    text-align: center
    background-image: url('~@/assets/img/day.jpg')
    background-size: cover
    &__block
      display: flex
      flex-direction: column
      justify-content: space-around
    &__intro
      height: 30%
    &__main
      height: 70%
    &__list
      width: 80%
      height: 90%
      display: flex
      flex-direction: column
      justify-content: space-around
      margin: 0 auto
      padding: 20px 20px 0 20px
      background-color: rgba(0, 0, 0, 0.25)
      border-radius: 10px

  .title
    padding-top: 10px
    margin: 0
    color: rgb(62, 64, 103)
    &__pre
      font-size: 24px
    &__main
      font-size: 42px
      line-height: 40px

  .controls
    height: 50px
    width: 100%
    &__container
      width: 100%
      height: 100%
      position: relative
      display: flex
      justify-content: center
      align-items: center

  .clear
    position: absolute
    right: 0
    &__button
      color: rgba(255,255,255, 0.7)
      border-bottom: 1px solid rgba(255,255,255, 0.7)
      font-size: 16px
      cursor: pointer

  .filters
    position: absolute
    margin: 0 auto

  .list
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: -17px
    margin: 0
    text-align: left
    overflow-y: scroll
    overflow-x: hidden
    &__wrapper
      position: relative
      height: 100%
      width: 100%
      overflow: hidden

</style>
