<template lang="html">
  <li class="todo"
    :class="{'todo--draggable': isDraggable, 'todo--completed': isCompleted}"
    >
    <input type="checkbox" v-model="todo.completed" @change="onCompletedChange">
    <div class="normal" v-show="!isEditing">
      <button type="button" @click="showSubTodos = !showSubTodos" v-show="hasSubTodos()">H</button>
      <label @dblclick="editTodo('title')">{{ `${todo.title}` }}</label>
      <label @dblclick="editTodo('time')" v-show="time">{{ `: ${time}h` }}</label>
      <button type="button" @click="addTodo">Add</button>
      <button type="button" @click="editTodo">Edit</button>
      <button type="button" @click="$emit('confirmRemove', todo.id)">X</button>
    </div>
    <div class="edit" v-show="isEditing">
      <input placeholder="New To-Do"
        type="text"
        v-model.trim="newTitle"
        v-todo-focus="isEditing && editFocused == 'title'"
        @blur="editBlur"
        @focus="editFocused = 'title'"
        @keyup.enter="finishEditTodo"
        @keyup.esc="cancelEditTodo">
      <input placeholder="Time"
        type="number"
        v-model="newTime"
        v-todo-focus="isEditing && editFocused == 'time'"
        :readonly="hasSubTodos()"
        @blur="editBlur"
        @focus="editFocused = 'time'"
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
        <ToDo
          v-for="(subTodo, index) in orderedSubTodos"
          :key="subTodo.id"
          :todo="subTodo"
          :class="`todo__num-${index}`"
          :idCounter="idCounter"
          @incId="$emit('incId')"
          @nodrag="cancelDraggable"
          @drag="allowDraggable"
          @completedChange="checkCompleted"
          @confirmRemove="confirmRemoveTodo"
          @remove="removeTodo"
          />
      </draggable>
    </ul>
  </li>
</template>

<script>
import ToDo from '@/components/ToDo.vue'
import draggable from 'vuedraggable'

export default {
  name: 'ToDo',
  components: {
    ToDo,
    draggable,
  },
  props: {
    todo: Object,
    idCounter: Number
  },
  data() {
    return {
      newTitle: this.todo.title,
      newTime: this.todo.time,
      isEditing: false,
      isDraggable: true,
      isCompleted: this.todo.completed,
      editFocused: 'title',
      showSubTodos: !this.todo.completed,
    }
  },
  computed: {
    orderedSubTodos() {
      return this.todo.subTodos.sort( (x, y) => {
        return x.completed === y.completed ?
          0 :
          y.completed ?
            -1 :
            1
        })
    },
    time() {
      if ( !this.hasSubTodos() ) {
        return this.todo.time
      }

      const hasTime = this.todo.subTodos.every( todo => !isNaN(todo.time) && todo.time>0)

      if (!hasTime)
        return ''

      return this.todo.subTodos.reduce( (acc, todo) => acc + parseFloat(todo.time), 0);
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
    'todo.time': function() {
      this.$emit('timeChange')
    },
    'todo.subTodos.length': function() {
      this.calculateTime()
      this.checkCompleted()
    }
  },
  methods: {
    addTodo() {
      const time = this.getNewTime()

      const newTodo = {
        id: this.newId(),
        title: '',
        time: time,
        completed: false,
        isEditing: true,
        subTodos: [],
      };

      this.showSubTodos = true
      this.todo.subTodos.push(newTodo)
    },
    newId() {
      this.$emit('incId')
      return this.idCounter
    },
    onCompletedChange() {
      const completed = this.todo.completed

      this.$emit('completedChange')
      this.completeChildTodos(completed)
    },
    calculateTime() {
      this.todo.time = this.getTotalSubTodosTime()
    },
    getTotalSubTodosTime() {
      if ( !this.hasSubTodos() ) {
        return this.todo.time
      }

      let l = this.todo.subTodos.reduce( (acc, todo) => {
        return acc + parseFloat(todo.time)
      }, 0)
      return l
    },
    checkCompleted() {
      this.todo.completed = this.allSubTodosCompleted()
      this.$emit('completedChange')
    },
    allSubTodosCompleted() {
      if ( !this.hasSubTodos() ) {
        return this.todo.completed
      }

      return this.todo.subTodos.every( todo => {
        return (todo.completed === true)
      })
    },
    completeChildTodos(val) {
      if ( !this.hasSubTodos() ) {
        return
      }

      this.todo.subTodos.forEach( todo => {
        todo.completed = val
        todo.el.completeChildTodos(val)
      })
    },
    getNewTime() {
      return this.hasSubTodos() ?
        this.todo.time - this.getTotalSubTodosTime() :
        this.todo.time
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
    cancelDraggable() {
      this.isDraggable = false
      this.$emit('nodrag');
    },
    allowDraggable() {
      this.isDraggable = true
      this.$emit('drag');
    },
    confirmRemoveTodo(id) {
      if (!window.confirm('Are you sure?')) {
        return;
      }

      this.removeTodo(id)
    },
    removeTodo(id) {
      const todoId = this.todo.subTodos.findIndex( el => el.id === id)

      this.todo.subTodos.splice(todoId, 1)
    },
    editTodo(focusInput) {
      if (focusInput === 'time' && this.hasSubTodos()) {
        return
      }

      if (!['title', 'time'].includes(focusInput)) {
        focusInput = 'title'
      }
      this.editFocused = focusInput
      this.setEditing(true)
      this.newTitle = this.todo.title
      this.cachedTitle = this.todo.title
      this.cachedTime = this.todo.time
    },
    cancelEditTodo() {
      if (this.editBlurTimeoutRunning) {
        clearTimeout(this.editBlurTimeout)
        this.editBlurTimeoutRunning = false
        this.newTitle = this.cachedTitle
        this.finishEditTodo()
        return
      }

      if (!this.cachedTitle || this.cachedTitle.length === 0) {
        this.$emit('remove', this.todo.id)
        return
      }

      this.todo.title = this.cachedTime
      this.todo.title = this.cachedTitle
      this.setEditing(false)
    },
    editBlur() {
      const vueThis = this

      this.editBlurTimeoutRunning = true
      this.editFocused = ''

      this.editBlurTimeout = setTimeout( () => {
        if (['title','time'].includes(vueThis.editFocused)) {
          return
        }

        vueThis.finishEditTodo()
        vueThis.editBlurTimeoutRunning = false
      }, 300);
    },
    finishEditTodo() {
      if (!this.isEditing) {
        return
      }

      const newTitle = this.newTitle && this.newTitle.trim()
      const timeVal = parseFloat(this.newTime);
      const newTime = !isNaN(timeVal) ? timeVal : 0 ;

      if (!newTitle || newTitle.length === 0) {
        this.$emit('remove', this.todo.id)
        return
      }

      this.todo.title = newTitle
      this.todo.time = newTime
      this.setEditing(false)
    },
    setEditing(bool) {
      this.isEditing = bool
      this.todo.isEditing = bool
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
