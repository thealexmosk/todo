<template lang="html">
  <div class="edit">
      <input
        :placeholder="placeholder"
        type="text"
        v-model.trim="editProp"
        ref="edit"
        @blur="onEditBlur"
        @keyup.enter="finishEditTodo"
        @keyup.esc="cancelEditTodo">
      <button type="button" @click="finishEditTodo">Ok</button>
      <button type="button" @click="cancelEditTodo">X</button>
  </div>
</template>

<script>
export default {
  props: ['prop', 'input', 'placeholder'],
  data() {
    return {
      editProp: this.prop,
    }
  },
  methods: {
    cancelEditTodo() {
      // if (this.editBlurTimeoutRunning) {
      //   clearTimeout(this.editBlurTimeout)
      //   this.editBlurTimeoutRunning = false
      //   this.finishEditTodo()
      //   return
      // }

      if (!this.prop || this.prop.length === 0) {
        this.$emit('editResult', 'remove')
        return
      }

      this.$emit('editResult', 'nochange')
    },
    finishEditTodo() {
      if (!this.editProp || this.editProp.length === 0) {
        this.$emit('editResult', 'remove')
        return
      }

      this.$emit('editResult', 'store', this.editProp)
    },
    onEditBlur() {

      const vueThis = this

      this.editBlurTimeoutRunning = true

      this.editBlurTimeout = setTimeout( () => {
        vueThis.finishEditTodo()
        vueThis.editBlurTimeoutRunning = false
      }, 300);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.edit.focus()
    });
  },
}
</script>

<style lang="css" scoped>
</style>
