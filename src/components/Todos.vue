<template lang="html">
  <div class="todos">
    <div class="todos__block todos__intro">
      <h1 class="title">
        <transition appear
          appear-active-class="appear-top appear-title">
          <div class="title__pre">
            An awesome
          </div>
        </transition>
        <transition appear
          appear-active-class="appear-bottom appear-title">
          <div class="title__main">
            Task Manager
          </div>
        </transition>
      </h1>
      <transition appear
        appear-active-class="appear-fade-in appear-add">
        <AddTodoInput class="add-todo"/>
      </transition>
    </div>
    <div class="todos__block todos__main">
      <transition appear
        appear-active-class="appear-fade-in appear-list">
        <div class="todos__list">
          <div class="list__wrapper">
            <div class="list">
              <TodoList :todos="todoList" :filter="filter"/>
            </div>
          </div>
          <div class="controls">
            <div class="controls__container">
              <ul class="filter">
                <li
                  class="filter__item"
                  :class="{'filter__item--active' : filter == 'all'}"
                  @click="filter = 'all'">
                  All
                </li>
                <li
                  class="filter__item"
                  :class="{'filter__item--active' : filter == 'active'}"
                  @click="filter = 'active'">
                  Active
                </li>
                <li
                  class="filter__item"
                  :class="{'filter__item--active' : filter == 'completed'}"
                  @click="filter = 'completed'">
                  Completed
                </li>
              </ul>
              <div class="clear">
                <div class="clear__button" @click="localClear">Clear all</div>
              </div>
            </div>
          </div>
        </div>
      </transition>
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
    },
    todoList() {
      return this.$store.getters.todoList
    },
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
  },
  beforeCreate() {
    (function initStore() {
      if (this.$store.state.todoList.length > 0) return;

      const makeTodoList = {title: 'Figure out how everything works', parentTodo: null, timeNeeded: 3};
      this.$store.dispatch('createTodo', makeTodoList);
      const mainId = 0;

      const subTodos = {title: 'You can create unlimited subtodos', parentTodo: mainId};
      this.$store.dispatch('createTodo', subTodos);

      const arrow = {title: 'Check out how buttons works', parentTodo: 1};
      this.$store.dispatch('createTodo', arrow);

      const completed = {title: 'Completed todos are auto-sorted', parentTodo: 1};
      this.$store.dispatch('createTodo', completed);
      this.$store.dispatch('completeTodo', {id: 3, complete: true});

      const drag = {title: 'You can also drag and drop todos', parentTodo: mainId};
      this.$store.dispatch('createTodo', drag);

      const save = {title: 'The data is auto-saved in your browser', parentTodo: mainId};
      this.$store.dispatch('createTodo', save);
      this.$store.dispatch('completeTodo', {id: 5, complete: true});

    }).call(this);
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
    overflow: hidden
    &__block
      display: flex
      flex-direction: column
      justify-content: space-around
    &__intro
      height: 27%
    &__main
      height: 73%
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
      font-size: 15px
      cursor: pointer
    @media (max-width: 480px)
      bottom: -20px
      right: auto

  .filter
    position: absolute
    margin: 0 auto
    padding: 0
    font-size: 14px
    border-radius: 10px
    cursor: pointer
    overflow: hidden
    opacity: 0.8
    &__item
      padding: 4px 12px
      display: inline-block
      &--active
        background-color: rgba(221, 223, 241, 0.8)
      &:not(.filter__item--active)
        background-color: rgba(221, 223, 241, 0.4)
        color: rgba(221, 223, 241, 0.8)

  .list
    padding-left: 10px
    position: absolute
    top: 0
    bottom: -17px
    left: 0
    right: 0
    margin: 0
    text-align: left
    overflow-y: scroll
    overflow-x: scroll
    &__wrapper
      position: relative
      height: 100%
      width: 100%
      overflow: hidden

  .appear-top
    opacity: 0
    animation: slideInFromTop 1.5s

  .appear-bottom
    opacity: 0
    animation: slideInFromBottom 1.5s

  .appear-fade-in
    opacity: 0
    animation: fadeIn 2.5s

  .appear-title
    animation-delay: 1s
  .appear-add
    animation-delay: 2s
  .appear-list
    animation-delay: 3s

  @keyframes slideInFromTop
    0%
      transform: translateY(-50%)
    100%
      transform: translateX(0)
      opacity: 1

  @keyframes slideInFromBottom
    0%
      transform: translateY(50%)
    100%
      transform: translateX(0)
      opacity: 1

  @keyframes fadeIn
    100%
      opacity: 1

</style>
