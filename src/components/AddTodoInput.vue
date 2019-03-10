<template lang="html">
  <div>
    <input
      placeholder="Add a todo"
      type="text"
      required="required"
      v-model.trim="newTitle"
      @keyup.enter="addTodo">
    <!-- <button type="button" @click="addTodo">Add</button> -->
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

<style lang="sass" scoped>
  input
    outline: none
    border: none
    border-radius: 10px
    padding: 10px 15px
    font-size: 16px
    background-color: rgb(0, 0, 0)
    color: rgb(255, 255, 255)
    opacity: 0.2
    font-family: 'Open Sans', sans-serif
    &::placeholder
      color: rgb(255, 255, 255)
</style>
