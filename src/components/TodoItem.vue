<template lang="html">
  <li class="todo"
    :class="{'todo--draggable': isDraggable, 'todo--completed': isCompleted}">
      <input type="checkbox" v-model="todo.data.completed" @change="onCompletedChange">
      <div class="normal" v-if="!isEditing">
          <button
            type="button"
            @click="showSubTodos = !showSubTodos"
            v-if="isNested && hasSubTodosComputed">
                {{ showSubTodos ? '-' : '+' }}
          </button>
          <label>{{ `${todo.data.title}` }}</label>
          <TimeNeeded v-if="todo.data.timeNeeded > 0" v-model="todo.data.timeNeeded" @open="value => isDraggable = !value"/>
          <DueDate v-if="todo.data.dueDate" v-model="todo.data.dueDate" @open="value => isDraggable = !value"/>
          <button type="button" @click="addTodo">Add</button>
          <button type="button" @click="isEditing=true">Edit</button>
          <button type="button" @click="todoExt">More</button>
          <button type="button" @click="$emit('confirmRemove', todo.data.id)">X</button>
      </div>
      <EditTodo
        v-if="isEditing"
        input="title"
        :prop="todo.data.title"
        @click="isEditing=true"
        @editResult="editResult">
          <button type="button" @click="$emit('openModal', {todo: todo, editField: 'title'})">More</button>
      </EditTodo>
      <TodoList
        v-show="isNested && hasSubTodosComputed && showSubTodos"
        v-model="currTodo.subTodos"
        :parent="currTodo"
        @openModal="$emit('openModal', $event)"
        @completedChange="checkCompleted"
        @draggableChange="changeDraggable"/>
  </li>
</template>

<script>
import TodoList from '@/components/TodoList.vue'
import TimeNeeded from '@/components/TimeNeeded.vue'
import DueDate from '@/components/DueDate.vue'
import EditTodo from '@/components/EditTodo.vue'
import Vue from 'vue'

export default {
  name: 'TodoItem',
  components: {
    TimeNeeded,
    EditTodo,
    DueDate,
    TodoList
  },
  props: {
    todo: Object,
    parent: Object,
    isNested: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currTodo: this.todo,
      isEditing: this.todo.data.title.length == 0,
      isCompleted: this.todo.data.completed,
      isDraggable: true,
      showSubTodos: !this.todo.data.completed,
    }
  },
  computed: {
    hasSubTodosComputed() {
      return this.currTodo.subTodos.length > 0
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
      this.isDraggable = !val
    },
    isDraggable(val) {
      this.$emit('draggableChange', val)
    },
    'todo.subTodos.length': function() {
      this.calculateTime()
      this.checkCompleted()
    }
  },
  methods: {
    todoExt(todo) {
      if (!this.isNested) {
        this.$emit('changeTodo', this.currTodo)
      } else {
        this.$emit('openModal', this.currTodo)
      }
    },
    changeDraggable(val) {
      this.isDraggable = val
      this.$emit('draggableChange', val)
    },
    checkCompleted() {
      this.todo.data.completed = this.allSubTodosCompleted()
      this.$emit('completedChange')
    },

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
    hasSubTodos() {
      return this.getSubTodosCount() > 0
    },
    getSubTodosCount() {
      return this.todo.subTodos.length
    },
    calculateTime() {
      this.todo.data.timeNeeded = this.getTotalSubTodosTime()
    },

    editResult(res, val) {
      if (res == 'store') {
        this.todo.data.title = val
      } else if (res == 'remove') {
        this.$emit('remove', this.todo.data.id)
      }

      this.isEditing = false
    },
    onCompletedChange() {
      const completed = this.todo.data.completed
      this.todo.data.completedAt = completed ? new Date() : null

      this.$emit('completedChange')
      this.completeChildTodos(completed)
    },

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

      addTodo() {
        const timeNeeded = this.getNewTime()
        const newTodo = new this.$Todo({timeNeeded: timeNeeded})

        this.showSubTodos = true
        this.todo.subTodos.push(newTodo)
      },
  },

  mounted() {
    if (this.todo.isEditing) {
      this.isEditing = this.todo.isEditing
    }
    if (!this.todo.parent && this.parent) {
      this.todo.parent = this.parent
    }
    if (!this.todo.el) {
      this.todo.el = this
    }
  },
}
</script>

<style lang="sass" scoped>
  .normal
    display: inline-block
  .edit
    display: inline-block
</style>
