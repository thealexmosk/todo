<template lang="html">
  <div class="modal__wrapper" @mousedown="close" ref="modal">
      <div class="modal__container">
        <DueDate :dueDate="todo.data.dueDate"/>
        <TimeNeeded :timeNeeded="todo.data.timeNeeded"/>
      </div>
  </div>
</template>

<script>
import DueDate from '@/components/DueDate.vue'
import TimeNeeded from '@/components/TimeNeeded.vue'

export default {
  name: 'TodoModal',
  components: {
    DueDate,
    TimeNeeded,
  },
  props: {
    todo: Object
  },
  methods: {
    close(event) {
      if (event.target == this.$refs.modal) {
        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  .modal
    &__wrapper
      position: fixed
      z-index: 999
      top: 0
      left: 0
      width: 100%
      height: 100%
      display: flex
      align-items: center
      justify-content: center
      background-color: rgba(0, 0, 0, 0.5)
    &__container
      width: 80%
      max-width: 700px
      min-width: 250px
      padding: 30px 20px
      background-color: rgba(255, 255, 255, 1)
      border-radius: 10px
</style>
