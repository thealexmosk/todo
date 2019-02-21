<template lang="html">
  <div class="time-field" :class="{'time-field--extended' : extended}">
    <div class="time-field__label" v-if="extended">
      Time Needed
    </div>
    <div class="todo-btn__container" @dblclick="openModal">
      <div class="time-field__val time-needed">
        <span>{{ timeStr }}</span>
      </div>
      <TodoButton type="edit" @click.native="isEditing = true" v-if="extended"/>
      <TimeNeededModal v-if="isEditing" @close="closeModal" v-model="time" @input="$emit('input', time)"/>
    </div>
  </div>
</template>

<script>
import TodoButton from '@/components/TodoButton.vue'
import TimeNeededModal from '@/components/TimeNeededModal.vue'
import humanizeDuration from 'humanize-duration'

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

      return humanizeDuration(this.time * 60000, {units: ['h', 'm']})
    }
  },
  methods: {
    openModal() {
      this.isEditing = true
      this.$emit('open', true)
    },
    closeModal(time) {
      this.isEditing = false
      this.$emit('open', false)
    }
  }
}
</script>

<style lang="sass" scoped>
  .time-needed
    background-color: rgba(45, 149, 191, 1)
</style>
