<template lang="html">
  <div class="edit">
      <input
        placeholder="Add a title"
        type="text"
        v-if="input == 'title'"
        v-model.trim="editProp"
        ref="edit"
        @blur="onEditBlur"
        @keyup.enter="finishEditTodo"
        @keyup.esc="cancelEditTodo"/>
        <textarea
          placeholder="Add a description"
          v-if="input == 'description'"
          v-model.trim="editProp"
          ref="edit"
          @blur="onEditBlur"
          @keyup.enter="finishEditTodo"
          @keyup.esc="cancelEditTodo"/>
      <button type="button" @click="finishEditTodo">Ok</button>
      <slot/>
      <button type="button" @click="cancelEditTodo">X</button>
  </div>
</template>

<script>
export default {
  props: ['todoId', 'prop', 'input', 'placeholder'],
  data() {
    return {
      editProp: this.prop,
      isEditing: true,
    }
  },
  methods: {
    checkFinishTimeout() {
      if (!this.editBlurTimeoutRunning) return

      clearTimeout(this.editBlurTimeout);
      this.editBlurTimeoutRunning = false;
    },
    cancelEditTodo() {
      this.checkFinishTimeout()

      if (!this.prop || this.prop.length === 0) {
        this.$store.dispatch('removeTodo', this.todoId);
      }

      this.$store.dispatch('unsetEditing');
    },
    finishEditTodo() {
      this.checkFinishTimeout()

      if (!this.editProp || this.editProp.length === 0) {
        this.$store.dispatch('removeTodo', this.todoId);
      } else {
        const editParams = {[this.input]: this.editProp};
        this.$store.dispatch('editTodo', {id: this.todoId, params: editParams});
      }

      this.$store.dispatch('unsetEditing');

      // Editing finished
      this.isEditing = false;
    },
    onEditBlur() {
      if (!this.isEditing) return
      const vueThis = this;

      this.editBlurTimeoutRunning = true;

      this.editBlurTimeout = setTimeout( () => {
        vueThis.editBlurTimeoutRunning = false;
        vueThis.finishEditTodo();
      }, 300);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.edit.focus();
    });
  },
}
</script>

<style lang="css" scoped>
</style>
