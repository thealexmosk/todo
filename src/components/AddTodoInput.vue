<template lang="html">
  <div class="todo__main-input">
    <input placeholder="New To-Do"
      type="text"
      required="required"
      v-model.trim="newTitle">
    <button type="button" @click="addTodo">Add</button>
  </div>
</template>

<script>

export default {
  props: {
    todo: Object,
  },
  data() {
    return {
      newTitle: '',
    }
  },
  methods: {
    addTodo() {
      const title = this.newTitle;

      if (title == '')
        return

      const todo = new this.$Todo({title: title})

      this.$emit('newTodo', todo)
    },
    cancelEditTodo() {

    },
  }
}
</script>

<style lang="css" scoped>
</style>
