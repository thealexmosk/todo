<template lang="html">
  <div class="time-field" :class="{'time-field--extended' : extended}">
    <div class="time-field__label" v-if="extended">
      Time Needed
    </div>
    <div class="todo-btn__container" @dblclick="openModal">
      <div class="time-field__main time-needed">
        <svg class="icon time-field__icon">
          <use xlink:href="#clock"/>
        </svg>
        <span class="time-field__val">{{ timeStr }}</span>
      </div>
      <div class="time-btn btn"
        @click="isEditing = true"
        v-if="extended">
        <svg class="icon icon-edit btn__icon"
          @click="isEditing = 'title'">
          <use xlink:href="#edit"/>
        </svg>
      </div>
      <TimeNeededModal v-if="isEditing" @close="closeModal" v-model="time" @input="$emit('input', time)"/>
    </div>
  </div>
</template>

<script>
import TodoButton from '@/components/TodoButton.vue'
import TimeNeededModal from '@/components/TimeNeededModal.vue'
import humanizeDuration from 'humanize-duration'

import clock from '@/assets/icons/svg/clock.svg'
import edit from '@/assets/icons/svg/edit.svg'

const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: 'shortEn',
  languages: {
    shortEn: {
      h: () => 'h',
      m: () => 'm',
    }
  }
})

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
      if (!this.value || this.value == 0) {
        return '? hours'
      }

      return shortEnglishHumanizer(this.value * 60000, {units: ['h', 'm']})
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
    background-color: rgb(62, 64, 103)
  .time-btn
    margin-left: 5px
</style>
