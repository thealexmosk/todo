<template lang="html">
  <li class="todo"
    :class="{'todo--draggable': isDraggable, 'todo--completed': todo.completed}">
      <div class="todo__item" :class="{'todo--has-subtodos' : hasSubTodos, 'todo--not-nested' : !nested}">
        <input type="checkbox" v-model="todo.completed" @change="completeChange">
        <div class="show-sub-todos"
          v-if="nested && hasSubTodos"
          @click="showSubTodos = !showSubTodos">
          <svg class="icon icon-chevron-down">
            <use xlink:href="#chevron-down" :transform="!showSubTodos ? 'rotate(-90 10 10)' : false"/>
          </svg>
        </div>
        <div class="todo__vals normal" v-if="!isEditing">
            <span class="todo__title"
              :class="{'todo__title--main' : todo.parentTodo === null}"
              @dblclick="$store.dispatch('setEditing', todo.id)"
              :title="todo.title">
                {{ todo.title }}
            </span>

            <TimeNeeded v-if="todo.timeNeeded > 0" v-model="todo.timeNeeded" @input="timeChange"  @open="value => isDraggable = !value"/>

            <DueDate v-if="todo.dueDate" v-model="todo.dueDate" @input="dueChange"  @open="value => isDraggable = !value"/>

            <div class="controls">
              <div class="controls__btn btn"
                @click="$store.commit('OPEN_MODAL', todo.id)">
                <svg class="icon icon-documents">
                  <use xlink:href="#documents"/>
                </svg>
              </div>

              <div class="controls__btn btn"
                @click="addTodo"
                v-if="nested">
                <svg class="icon icon-add">
                  <use xlink:href="#add-to-list"/>
                </svg>
              </div>

              <div class="controls__btn btn"
                @click="$store.dispatch('setEditing', todo.id)">
                <svg class="icon icon-edit">
                  <use xlink:href="#edit"/>
                </svg>
              </div>

              <div class="controls__btn btn"
                @click="confirmRemove">
                <svg class="icon icon-remove">
                  <use xlink:href="#cross"/>
                </svg>
              </div>
            </div>
        </div>
        <EditTodo
          class="todo__vals"
          v-if="isEditing"
          input="title"
          :todoId="todo.id"
          :prop="todo.title">
        </EditTodo>
      </div>
      <TodoList
        v-show="nested && showSubTodos"
        :parent="todo.id"
        :nested="nested"
        :todos="$store.getters.subTodos(todo.id)"
        style="padding-left: 25px"
        @draggableChange="changeDraggable"/>
  </li>
</template>

<script>
import TodoList from '@/components/TodoList.vue'
import EditTodo from '@/components/EditTodo.vue'
import TimeNeeded from '@/components/TimeNeeded.vue'
import DueDate from '@/components/DueDate.vue'

import chewronDown from '@/assets/icons/svg/chevron-down.svg'
import documents from '@/assets/icons/svg/documents.svg'
import addToList from '@/assets/icons/svg/add-to-list.svg'
import edit from '@/assets/icons/svg/edit.svg'
import remove from '@/assets/icons/svg/cross.svg'

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
      showSubTodos: !this.todo.completed || this.todo.subTodos.length == 0,
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
    hasSubTodos() {
      return this.todo.subTodos.length > 0;
    },
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
    transition: opacity 0.5s ease
    &__item
      display: inline-flex
      align-items: center
      margin-bottom: 3px
      height: 45px
      padding: 10px 15px
      background-color: rgb(221, 223, 241)
      border-radius: 8px
      cursor: default
      &:hover
        .controls
          opacity: 1
    &__title
      margin-right: 5px
      max-width: 300px
      text-overflow: ellipsis
      overflow: hidden
      white-space: nowrap
      &--main
        font-weight: bold
    &__vals
      display: flex
      align-items: center
    &--main
      font-weight: bold
    &--completed
      opacity: 0.5
    &--has-subtodos
      margin-bottom: 8px
    &--not-nested
      margin-bottom: 8px

  .controls
    opacity: 0.4
    transition: opacity 0.5s ease

  .icon
    &-chevron-down
      width: 20px
      height: 20px

  .show-sub-todos
    display: inline-block
    width: 20px
    height: 20px

</style>
