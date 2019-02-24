<template lang="html">
  <button class="todo-btn__btn" type="button">{{ btn }}</button>
</template>

<script>
export default {
  name: 'TodoButton',
  props: {
    type: String
  },
  computed: {
    btn() {
      switch (this.type) {
        case 'edit':
        return '|'
        break;
        default:

      }
    }
  }
}
</script>

<style lang="sass">
.todo-btn
  &__container
    display: flex
    align-items: center
  &__btn
    display: inline-block
    margin-left: 8px
</style>
