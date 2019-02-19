<template lang="html">
  <div class="time-field">
    <div class="time-field__label" v-if="extended">
      Due Date
    </div>
    <div class="todo-btn__container">
      <div class="time-field__val due-date" @dblclick="openDatetime">
        <span>{{ dateStr }}</span>
      </div>
      <TodoButton type="edit" @click.native="openDatetime"/>
      <Datetime v-model="date" type='datetime' input-id="datetime"/>
    </div>
  </div>
</template>

<script>
import TodoButton from '@/components/TodoButton.vue'
import {Datetime} from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'

export default {
  components: {
    TodoButton,
    Datetime
  },
  props: {
    dueDate: Date,
    extended: Boolean,
  },
  data() {
    return {
      isEditing: false,
      date: this.dueDate,
    }
  },
  computed: {
    dateStr() {
      const date = this.date || 'Due ?'

      return date
    }
  },
  methods: {
    openDatetime() {
      document.getElementById('datetime').click()
    }
  }
}
</script>

<style lang="sass" scoped>
  .due-date
    background-color: rgba(78, 186, 111, 1)
</style>

<!-- Overriding Datetime classes -->
<style lang="sass">
  #datetime
    display: none
  .vdatetime-popup
    border-radius: 5px
</style>
