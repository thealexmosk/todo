<template lang="html">
  <transition name="fade">
    <div class="vdatetime-overlay modal" ref="modal" @click="close">
        <div class="vdatetime-popup">
            <div class="vdatetime-popup__header">
              <div class="header__hours header__time">{{ `${strHours} hours` }}</div>
              <div class="header__minutes header__time">{{ `${strMinutes} minutes` }}</div>
            </div>
            <div class="vdatetime-popup__body time-needed">
                <div class="time-needed__time">
                    <div class="time__label">
                      Hours
                    </div>
                    <div class="time__input">
                      <input type="number" @input="validateHours" v-model="hours" ref="hours" placeholder="0">
                    </div>
                </div>
                <div class="time-needed__time">
                    <div class="time__label">
                      Minutes
                    </div>
                    <div class="time__input">
                      <input type="number" @input="validateMinutes" v-model="minutes" placeholder="0">
                    </div>
                </div>
            </div>
            <div class="vdatetime-popup__actions">
              <div class="vdatetime-popup__actions__button vdatetime-popup__actions__button--cancel" @click="$emit('close')">
                Cancel
              </div>
              <div class="vdatetime-popup__actions__button vdatetime-popup__actions__button--confirm" @click="submit">
                Ok
              </div>
            </div>
        </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ['value'],
  data() {
    return {
      hours: this.parseHours(this.value),
      minutes: this.parseMins(this.value),
    }
  },
  computed: {
    strHours() {
      return this.getStrTime(this.hours)
    },
    strMinutes() {
      return this.getStrTime(this.minutes)
    },
  },
  methods: {
    parseMins(value) {
      if ( !value || isNaN(value))
        return undefined

      const mins = parseInt(value) % 60

      return mins > 0 ? mins : undefined
    },
    parseHours(value) {
      if ( !value || isNaN(value) || value == 0)
        return undefined

      const hours = Math.floor(parseInt(value) / 60)

      return hours > 0 ? hours : undefined
    },
    validateHours() {
      this.hours =
        this.hours > 10000 ?
        10000 :
          this.hours < 0 ?
          0 :
          parseInt(this.hours)
    },
    validateMinutes() {
      this.minutes =
        this.minutes > 59 ?
        59 :
          this.minutes < 0 ?
          0 :
          parseInt(this.minutes)
    },
    getStrTime(val) {
      return !val || isNaN(val) ? 0 : val
    },
    calculateMinutes() {
      const hours = this.getStrTime(this.hours)
      const minutes = this.getStrTime(this.minutes)

      return hours*60 + minutes
    },
    submit() {
      this.$emit('input', this.calculateMinutes())
      this.$emit('close')
    },
    close(event) {
      if (event.target == this.$refs.modal) {
        this.$emit('close')
      }
    }
  },
  mounted() {
    this.$refs.hours.focus()
  }
}
</script>

<style lang="sass" scoped>
  .header
    &__time
      display: inline-block
      &:not(:last-child)
        margin-right: 10px
    &__minutes
      font-size: 20px
  .time-needed
    display: flex
    justify-content: center
    align-items: center
    flex-wrap: wrap
    padding: 20px
    &__time
      &:not(:last-child)
        margin-right: 10px
  .time
    &__label
      font-size: 20px
    &__input
      input
        width: 5em

</style>
