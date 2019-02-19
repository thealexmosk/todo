<template lang="html">
  <div class="time-field">
    <div class="time-field__label" v-if="extended">
      Time Needed
    </div>
    <div class="todo-btn__container">
      <div class="time-field__val time-needed">
        <span>{{ timeStr }}</span>
      </div>
      <TodoButton type="edit" @click.native="isEditing = true"/>
      <TimeNeededModal v-if="isEditing" @close="isEditing = false" v-model="time" @input="$emit('input', time)"/>
    </div>
  </div>
</template>

<script>
import TodoButton from '@/components/TodoButton.vue'
import TimeNeededModal from '@/components/TimeNeededModal.vue'

export default {
  components: {
    TodoButton,
    TimeNeededModal
  },
  props: {
    value: Number,
    extended: Boolean,
  },
  data() {
    return {
      time: this.value,
      isEditing: false,
    }
  },
  computed: {
    timeStr() {
      if (!this.time || this.time == 0) {
        return '? hours'
      }

      const time = parseInt(this.time)
      const timeHours = Math.floor(time/60)
      const timeMinutes = time % 60

      return `${timeHours}h ${timeMinutes}m`
    }
  }
}
</script>

<style lang="sass" scoped>
  .time-needed
    background-color: rgba(45, 149, 191, 1)
</style>
