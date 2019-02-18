<template lang="html">
  <div class="time-field">
    <div class="time-field__label" v-if="extended">
      Due Date
    </div>
    <div class="todo-btn__container">
      <div class="time-field__val due-date">
        <span>{{ date }}</span>
      </div>
      <TodoButton type="edit"/>
    </div>
  </div>
</template>

<script>
import TodoButton from '@/components/TodoButton.vue'

export default {
  components: {
    TodoButton
  },
  props: {
    dueDate: Date,
    extended: Boolean,
  },
  computed: {
    date() {
      const date = this.dueDate || 'Due ?'

      return date
    }
  }
}
</script>

<style lang="sass" scoped>
  .due-date
    background-color: rgba(78, 186, 111, 1)
</style>
