import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

class Todo {
  constructor({
    title = '',
    description = '',
    completed = false,
    dueDate = null,
    timeNeeded = 0,
    completedAt = null,
    parentTodo = null,
  } = {}) {
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.dueDate = dueDate;
    this.timeNeeded = timeNeeded;
    this.completedAt = completedAt;
    this.createdAt = new Date();
    this.parentTodo = parentTodo;
    this.subTodos = [];
  }
}
// Todos
export default new Vuex.Store({
  state: {
    todos: {},
    todoList: [],
    todoIdCounter: 0,
    editingTodo: null,
    showModal: false,
    modalTodo: null,
  },
  mutations: {
    ADD_TODO: (state, payload) => {
      const newTodo = new Todo(payload);
      const id = state.todoIdCounter++;
      newTodo.id = id;

      Vue.set(state.todos, id, newTodo);

      // Push todo to global todoList or to parent subTodos
      if (newTodo.parentTodo === null) {
        state.todoList.push(id);
      } else if (Number.isInteger(newTodo.parentTodo)) {
        state.todos[newTodo.parentTodo].subTodos.push(id);
        state.editingTodo = id;
      }
    },
    EDIT_TODO: (state, payload) => {
      const editingTodo = state.todos[payload.id];
      const newTodo = { ...editingTodo, ...payload.params};

      if (!state.todos[payload.id]) return;

      Vue.set(state.todos, payload.id, newTodo);
    },
    COMPLETE_TODO: (state, payload) => {
      const todo = state.todos[payload.id];
      const complete = payload.complete;

      // Complete todo and subTodos
      ;(function recSubTodosComplete(todoId) {
        const todo = state.todos[todoId];

        todo.completed = complete;
        todo.completedAt = complete ? new Date() : null;

        if (todo.subTodos.length > 0) {
          todo.subTodos.forEach(id => recSubTodosComplete(id));
        }
      })(payload.id);
    },
    CHECK_COMPLETE_TODOS_PARENTS: (state, {id, parentId}) => {
      const parId = id !== undefined ? state.todos[id].parentTodo : parentId;
      if (parId === null) return;

      ;(function recParentComplete(todoId) {
        const todo = state.todos[todoId];
        const childrenComplete = todo.subTodos.every( ind => state.todos[ind].completed );

        todo.completed = childrenComplete;
        todo.completedAt = childrenComplete ? new Date() : null;

        if (todo.parentTodo !== null) {
          recParentComplete(todo.parentTodo);
        }
      })(parId);
    },
    REMOVE_TODO: (state, id) => {
      const todo = state.todos[id];
      // Remove from todoList
      if (state.todoList.includes(id)) {
        const ind = state.todoList.indexOf(id);

        if (ind > -1) {
          state.todoList.splice(ind, 1);
        }
        // state.todoList = state.todoList.filter(item => item !== id);
      }

      // Remove from parent
      if (todo.parentTodo !== null) {
        const ind = state.todos[todo.parentTodo].subTodos.indexOf(id);

        if (ind > -1) {
          state.todos[todo.parentTodo].subTodos.splice(ind, 1);
        }
      }
      // Remove todo & subTodos
      ;(function recRemove(todoId) {
        const todo = state.todos[todoId];

        if (todo.subTodos.length > 0) {
          todo.subTodos.forEach(id => recRemove(id));
        }

        delete state.todos[todoId];
      })(id);
    },
    REMOVE_ALL: (state) => {
      state.todos = {};
      state.todoList = [];
      state.todoIdCounter = 0;
      state.editingTodo = null;
    },
    CHANGE_ORDER: (state, params) => {
      if (params.parent === undefined) {
        state.todoList = params.arr;
      } else {
        state.todos[params.parent].subTodos = params.arr;
      }

      // Change old parent's subTodos and this parent
      params.arr.forEach( id => {
        const todo = state.todos[id];

        todo.parentTodo = params.parent !== undefined ? params.parent : null;
      });
    },
    SET_EDITING: (state, id) => {
      state.editingTodo = id;
    },
    UNSET_EDITING: (state) => {
      state.editingTodo = null;
    },
  },
  actions: {
    addTodo: (context, params) => {
      context.commit('ADD_TODO', params);
    },
    editTodo: (context, todo) => {
      context.commit('EDIT_TODO', todo);
    },
    removeTodo: (context, id) => {
      context.commit('REMOVE_TODO', id);
    },
    removeAll: (context) => {
      context.commit('REMOVE_ALL');
    },
    completeTodo: (context, params) => {
      context.commit('COMPLETE_TODO', params);
      context.commit('CHECK_COMPLETE_TODOS_PARENTS', {id: params.id});
    },
    setEditing: (context, id) => {
      context.commit('SET_EDITING', id);
    },
    unsetEditing: (context) => {
      context.commit('UNSET_EDITING');
    },
    changeOrder: (context, params) => {
      context.commit('CHANGE_ORDER', params);

      // if (params.parent !== undefined)
      //   context.commit('CHECK_COMPLETE_TODOS_PARENTS', {parentId: params.parent});
    }
  },
  getters: {
    todoList: state => {
      return state.todoList.map(id => state.todos[id]);
    },
    subTodos: (state) => (id) => {
      return state.todos[id].subTodos.filter(id => state.todos[id]).map(id => state.todos[id]);
    },
    isEditing: (state) => (id) => {
      return id === state.editingTodo
    },
    hasSubTodos: (state) => (id) => {
      return state.todos[id].subTodos.length > 0
    },
  },
  plugins: [createPersistedState()]
})
