<template lang="html">
  <li class="todo"
    :class="{'todo--draggable': isDraggable, 'todo--completed': isCompleted}">
      <input type="checkbox" v-model="todo.data.completed" @change="onCompletedChange">
      <div class="normal" v-show="!isEditing">
          <button type="button" @click="showSubTodos = !showSubTodos" v-show="hasSubTodos()">{{ showSubTodos ? '-' : '+' }}</button>
          <label>{{ `${todo.data.title}` }}</label>
          <TimeNeeded v-show="todo.data.timeNeeded > 0" :timeNeeded="todo.data.timeNeeded"/>
          <button type="button" @click="addTodo">Add</button>
          <button type="button" @click="editTodo">Edit</button>
          <button type="button" @click="$emit('confirmRemove', todo.data.id)">X</button>
      </div>
      <div class="edit" v-show="isEditing">
          <input placeholder="New To-Do"
            type="text"
            v-model.trim="title"
            v-todo-focus="isEditing"
            @blur="onEditBlur"
            @keyup.enter="finishEditTodo"
            @keyup.esc="cancelEditTodo">
          <button type="button" @click="finishEditTodo">Ok</button>
          <button type="button" @click="cancelEditTodo">X</button>
      </div>
      <ul class="subTodos" v-show="showSubTodos">
          <draggable
            v-model="todo.subTodos"
            :move="isMovable"
            :options="{draggable:'.todo--draggable', group:'todos'}">
              <TodoItem
                v-for="(subTodo, index) in filteredTodos"
                :key="subTodo.data.id"
                :todo="subTodo"
                :class="`todo__num-${index}`"
                @nodrag="cancelDraggable"
                @drag="allowDraggable"
                @completedChange="checkCompleted"
                @confirmRemove="confirmRemoveTodo"
                @remove="removeTodo"/>
          </draggable>
      </ul>
  </li>
</template>

<script>
import TodoItem from '@/components/TodoItem.vue'
import TimeNeeded from '@/components/TimeNeeded.vue'
import DueDate from '@/components/DueDate.vue'
import draggable from 'vuedraggable'
import Vue from 'vue'

export default {
  name: 'TodoItem',
  components: {
    TodoItem,
    TimeNeeded,
    DueDate,
    draggable,
  },
  props: {
    todo: Object
  },
  data() {
    return {
      title: this.todo.data.title,
      isEditing: this.todo.data.title.length == 0,
      isCompleted: this.todo.data.completed,
      isDraggable: true,
      showSubTodos: !this.todo.data.completed,
    }
  },
  computed: {
    filteredTodos() {
      return Vue.prototype.$todoFilters['all'](this.todo.subTodos)
    },
    time() {
      if ( !this.hasSubTodos() ) {
        return this.todo.data.timeNeeded
      }

      const hasTime = this.todo.subTodos.every( todo => !isNaN(todo.data.timeNeeded) && todo.data.timeNeeded>0)

      if (!hasTime)
        return ''

      return this.todo.subTodos.reduce( (acc, todo) => acc + parseFloat(todo.data.timeNeeded), 0);
    }
  },
  watch: {
    isEditing(val) {
      if (val) {
        this.cancelDraggable()
      } else {
        this.allowDraggable()
      }
    },
    // 'todo.data.timeNeeded': function() {
    //   this.$emit('timeChange')
    // },
    'todo.subTodos.length': function() {
      this.calculateTime()
      this.checkCompleted()
    }
  },
  methods: {

// Emitters

    cancelDraggable() {
      this.isDraggable = false
      this.$emit('nodrag');
    },
    allowDraggable() {
      this.isDraggable = true
      this.$emit('drag');
    },
    checkCompleted() {
      this.todo.data.completed = this.allSubTodosCompleted()
      this.$emit('completedChange')
    },

// Getters

    getTotalSubTodosTime() {
      if ( !this.hasSubTodos() ) {
        return this.todo.data.timeNeeded
      }

      let l = this.todo.subTodos.reduce( (acc, todo) => {
        return acc + parseFloat(todo.data.timeNeeded)
      }, 0)
      return l
    },
    allSubTodosCompleted() {
      if ( !this.hasSubTodos() ) {
        return this.todo.data.completed
      }

      return this.todo.subTodos.every( todo => {
        return (todo.data.completed === true)
      })
    },
    getNewTime() {
      return this.hasSubTodos() ?
        this.todo.data.timeNeeded - this.getTotalSubTodosTime() :
        this.todo.data.timeNeeded
    },
    isMovable(evt) {
      return (!evt.draggedContext.element.isEditing)
    },
    hasSubTodos() {
      return this.getSubTodosCount() > 0
    },
    getSubTodosCount() {
      return this.todo.subTodos.length
    },

// Setters

    setEditing(bool) {
      this.isEditing = bool
      // this.todo.isEditing = bool
    },
    calculateTime() {
      this.todo.data.timeNeeded = this.getTotalSubTodosTime()
    },

// Events

  onCompletedChange() {
    const completed = this.todo.data.completed
    this.todo.data.completedAt = completed ? new Date() : null

    this.$emit('completedChange')
    this.completeChildTodos(completed)
  },
  onEditBlur() {
    const vueThis = this

    this.editBlurTimeoutRunning = true
    this.editFocused = ''

    this.editBlurTimeout = setTimeout( () => {
      vueThis.finishEditTodo()
      vueThis.editBlurTimeoutRunning = false
    }, 300);
  },

// Actions

    completeChildTodos(val) {
      if ( !this.hasSubTodos() ) {
        return
      }

      this.todo.subTodos.forEach( todo => {
        todo.data.completed = val
        todo.data.completedAt = val ? new Date() : null
        todo.el.completeChildTodos(val)
      })
    },

// Todo CRUD methods

    addTodo() {
      const timeNeeded = this.getNewTime()
      const newTodo = new this.$Todo({timeNeeded: timeNeeded})

      this.showSubTodos = true
      this.todo.subTodos.push(newTodo)
    },

    removeTodo(id) {
      const todoId = this.todo.subTodos.findIndex( el => el.data.id === id)

      this.todo.subTodos.splice(todoId, 1)
    },
    confirmRemoveTodo(id) {
      if (!window.confirm('Are you sure?')) {
        return;
      }

      this.removeTodo(id)
    },

// Edit Todo methods

    editTodo() {
      this.title = this.cachedTitle = this.todo.data.title
      this.setEditing(true)
    },
    cancelEditTodo() {
      if (this.editBlurTimeoutRunning) {
        clearTimeout(this.editBlurTimeout)
        this.editBlurTimeoutRunning = false
        this.title = this.cachedTitle
        this.finishEditTodo()
        return
      }

      if (!this.cachedTitle || this.cachedTitle.length === 0) {
        this.$emit('remove', this.todo.data.id)
        return
      }

      this.todo.data.title = this.cachedTitle
      this.setEditing(false)
    },
    finishEditTodo() {
      if (!this.isEditing) {
        return
      }

      const title = this.title

      if (!title || title.length === 0) {
        this.$emit('remove', this.todo.data.id)
        return
      }

      this.todo.data.title = title
      this.setEditing(false)
    },
  },

  mounted() {
    if (this.todo.isEditing) {
      this.isEditing = this.todo.isEditing
    }
    this.todo.el = this
  },

  directives: {
    'todo-focus': function(el, binding) {
      if (binding.value) {
        el.focus();
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  .normal
    display: inline-block
  .edit
    display: inline-block
</style>
