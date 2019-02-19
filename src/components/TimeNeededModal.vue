<template lang="html">
  <div class="vdatetime-overlay" ref="modal" @click="close">
      <div class="vdatetime-popup">
          <div class="vdatetime-popup__header">
            <div class="header__hours header__time">{{ `${hours} hours` }}</div>
            <div class="header__minutes header__time">{{ `${minutes} minutes` }}</div>
          </div>
          <div class="vdatetime-popup__body time-needed">
              <div class="time-needed__time">
                  <div class="time__label">
                    Hours
                  </div>
                  <div class="time__input">
                    <input type="number" @change="validateHours" v-model="hours">
                  </div>
              </div>
              <div class="time-needed__time">
                  <div class="time__label">
                    Minutes
                  </div>
                  <div class="time__input">
                    <input type="number" @change="validateMinutes" v-model="minutes">
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
  methods: {
    parseMins(value) {
      return parseInt(value) % 60
    },
    parseHours(value) {
      return Math.floor(parseInt(value) / 60)
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
    calculateMinutes() {
      return this.hours*60 + this.minutes
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
    console.log(this.value)
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
