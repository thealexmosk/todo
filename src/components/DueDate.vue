<template lang="html">
  <div class="due-date">
    <label>{{ date }}</label>
  </div>
</template>

<script>
export default {
  props: {
    dueDate: Date,
  },
  computed: {
    date() {
      return this.dueDate + 'due'
    }
  }
}
</script>

<style lang="css" scoped>
</style>
