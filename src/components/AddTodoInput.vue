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
    parent: {
      type: [Number, Object],
      default: null
    },
    edit: {
      type: Boolean,
      default: false
    }
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
        return;

      this.$store.dispatch('createTodo', { title, parentTodo: this.parent, edit: this.edit});
      this.newTitle = '';
    },
  }
}
</script>

<style lang="css" scoped>
</style>
