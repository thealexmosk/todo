<template lang="html">
  <div class="time-field" :class="{'time-field--extended' : extended}">
    <div class="time-field__label" v-if="extended">
      Due Date
    </div>
    <div class="todo-btn__container">
      <div class="time-field__main due-date" @dblclick="openDatetime">
        <svg class="icon time-field__icon">
          <use xlink:href="#calendar"/>
        </svg>
        <span class="time-field__val">{{ dateStr }}</span>
      </div>
      <div class="time-btn btn"
        @click="openDatetime" v-if="extended">
        <svg class="icon icon-edit btn__icon">
          <use xlink:href="#edit"/>
        </svg>
      </div>
      <Datetime
        v-model="date"
        class="theme-purple"
        type='datetime'
        input-id="datetime"
        @input="$emit('input', date)"
        :minute-step="5"
        :min-datetime="now.toJSON()"
        ref="datetime"/>
    </div>
  </div>
</template>

<script>
import TodoButton from '@/components/TodoButton.vue'
import {Datetime} from 'vue-datetime'
import humanizeDuration from 'humanize-duration'
import 'vue-datetime/dist/vue-datetime.css'

import calendar from '@/assets/icons/svg/calendar.svg'

const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: 'shortEn',
  languages: {
    shortEn: {
      y: () => 'y',
      mo: () => 'mo',
      w: () => 'w',
      d: () => 'd',
      h: () => 'h',
      m: () => 'm',
      s: () => 's',
      ms: () => 'ms',
    }
  }
})

export default {
  components: {
    TodoButton,
    Datetime,
  },
  props: {
    value: String,
    extended: Boolean,
  },
  data() {
    return {
      date: this.value,
      now: new Date()
    }
  },
  computed: {
    dateStr() {
      const date = this.value || 'Due ?'
      const diffMs = new Date(date) - this.now

      if (diffMs < 0)
        return 'Past Due'

      const dateStr = shortEnglishHumanizer(diffMs, { delimiter: ' ', units: ['mo', 'd', 'h'], largest: 1, round: true })
      return `${dateStr} left`
    }
  },
  methods: {
    openDatetime() {
      document.getElementById('datetime').click()
    },
    setWatchIsOpen() {
      this.$watch(
      	() => {
      		return this.$refs.datetime.isOpen
      	},
        (val) => {
          this.$emit('open', val)
        }
      )
    },
  },
  mounted() {
    this.setWatchIsOpen()
  }
}
</script>

<style lang="sass" scoped>
  .due-date
    background-color: rgb(62, 64, 103)
  .time-btn
    margin-left: 5px
</style>
