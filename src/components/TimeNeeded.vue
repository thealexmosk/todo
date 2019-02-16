<template lang="html">
  <div class="due-date">
    <label>{{ timeNeeded }}</label>
  </div>
</template>

<script>
export default {
  props: {
    timeNeeded: Number,
  },
  computed: {
    date() {
      return this.dueDate + 'h'
    }
  }
}
</script>

<style lang="css" scoped>
</style>
