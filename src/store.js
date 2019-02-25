import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

class Todo {
  constructor({
    title = '',
    description = '',
    completed = false,
    dueDate = null,
    timeNeeded = 0,
    completedAt = null,
    parentTodoId = null,
  } = {}) {
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.dueDate = dueDate;
    this.timeNeeded = timeNeeded;
    this.completedAt = completedAt;
    this.createdAt = new Date();
    this.parentTodo = parentTodoId;
    this.subTodos = [];
  }
}
// Todos
export default new Vuex.Store({
  state: {
    todos: [],
    idCounter: 0
  },
  mutations: {
    ADD_TODO: (state, todo) => {
      const newTodo = new Todo(todo)

      newTodo.id = state.idCounter++;

      state.todos.push(newTodo);
    }
  },
  actions: {
    addTodo: (context, todo) => {
      context.commit('ADD_TODO', todo)
    }
  },
  getters: {
    mainTodos: state => {
      return state.todos.filter(todo => todo.parentTodo === null)
    }
  }
})
