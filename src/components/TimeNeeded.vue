<template lang="html">
  <div class="time-field">
    <div class="time-field__label" v-if="extended">
      Time Needed
    </div>
    <div class="todo-btn__container">
      <div class="time-field__val time-needed">
        <span>{{ time }}</span>
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
    timeNeeded: Number,
    extended: Boolean,
  },
  computed: {
    time() {
      const time = this.timeNeeded || '?'
      return `${time} hours`
    }
  }
}
</script>

<style lang="sass" scoped>
  .time-needed
    background-color: rgba(45, 149, 191, 1)
</style>
