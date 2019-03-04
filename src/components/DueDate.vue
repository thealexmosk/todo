<template lang="html">
  <div class="time-field" :class="{'time-field--extended' : extended}">
    <div class="time-field__label" v-if="extended">
      Due Date
    </div>
    <div class="todo-btn__container">
      <div class="time-field__val due-date" @dblclick="openDatetime">
        <span>{{ dateStr }}</span>
      </div>
      <TodoButton type="edit" @click.native="openDatetime" v-if="extended"/>
      <Datetime
        v-model="date"
        class="theme-green"
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
      return `${dateStr} Left`
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
    background-color: rgba(78, 186, 111, 1)
</style>

<!-- Overriding Datetime classes -->
<style lang="sass">
  #datetime
    display: none
  .vdatetime-popup
    border-radius: 5px

  .theme-green .vdatetime-popup__header,
  .theme-green .vdatetime-calendar__month__day--selected > span > span,
  .theme-green .vdatetime-calendar__month__day--selected:hover > span > span
    background-color: rgba(78, 186, 111, 1)


  .theme-green .vdatetime-year-picker__item--selected,
  .theme-green .vdatetime-time-picker__item--selected,
  .theme-green .vdatetime-popup__actions__button
    color: rgba(78, 186, 111, 1)
</style>
