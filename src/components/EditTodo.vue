<template lang="html">
  <div class="edit">
      <input
        placeholder="Add a title"
        class="edit__field"
        type="text"
        v-if="input == 'title'"
        v-model.trim="editProp"
        ref="edit"
        @blur="onEditBlur"
        @keyup.enter="finishEditTodo"
        @keyup.esc="cancelEditTodo"/>

        <textarea
          placeholder="Add a description"
          class="edit__field description"
          v-if="input == 'description'"
          v-model.trim="editProp"
          ref="edit"
          @blur="onEditBlur"
          @keyup.enter="finishEditTodo"
          @keyup.esc="cancelEditTodo"/>

        <div class="controls">
          <div class="controls__btn"
            @click="finishEditTodo">
            <svg class="icon icon-ok">
              <use xlink:href="#check"/>
            </svg>
          </div>
          <div class="controls__btn"
            @click="cancelEditTodo">
            <svg class="icon icon-remove">
              <use xlink:href="#cross"/>
            </svg>
          </div>
        </div>
  </div>
</template>

<script>
import check from '@/assets/icons/svg/check.svg'
import remove from '@/assets/icons/svg/cross.svg'

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

      this.$store.dispatch('unsetEditing');
    },
    finishEditTodo() {
      this.checkFinishTimeout()

      const editParams = {[this.input]: this.editProp};
      this.$store.dispatch('editTodo', {id: this.todoId, params: editParams});

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

<style lang="sass" scoped>
  .edit
    display: flex
    align-items: center
    &__field
      width: 300px
      margin-right: 7px
      padding: 5px 10px
      font-size: 16px
      background-color: rgba(0, 0, 0, 0.2)
      color: rgba(255, 255, 255, 0.8)
      outline: none
      border: none
      border-radius: 5px
      font-family: 'Open Sans', sans-serif
      &::placeholder
        color: rgba(255, 255, 255, 0.8)
    .description
      height: 70px
</style>
