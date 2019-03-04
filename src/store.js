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
function completeTodo(state, payload) {
  const todo = state.todos[payload.id];
  const complete = payload.complete;

  todo.completed = complete;
  todo.completedAt = complete ? new Date() : null;
}
// Todos
const store = new Vuex.Store({
  state: {
    todos: {},
    todoList: [],
    todoIdCounter: 0,
    editingTodo: null,
    modalTodo: null,
  },
  mutations: {
    CREATE_TODO: (state, payload) => {
      Vue.set(state.todos, payload.id, payload);
    },
    ADD_TODO_TO_LIST: (state, id) => {
      state.todoList.push(id);
    },
    ADD_TODO_TO_SUBTODOS: (state, payload) => {
      state.todos[payload.toId].subTodos.push(payload.id);
    },
    INC_TODO_ID_COUNTER: (state) => {
      state.todoIdCounter++;
    },
    EDIT_TODO: (state, payload) => {
      if (!state.todos[payload.id]) return;

      const editingTodo = state.todos[payload.id];
      const newTodo = { ...editingTodo, ...payload.params};

      Vue.set(state.todos, payload.id, newTodo);
    },
    SET_TIME_NEEDED: (state, payload) => {
      state.todos[payload.id].timeNeeded = payload.timeNeeded;
    },
    SET_DUE_DATE: (state, payload) => {
      state.todos[payload.id].dueDate = payload.dueDate;
    },
    COMPLETE_TODO: (state, payload) => completeTodo(state, payload),
    COMPLETE_SUBTODOS: (state, payload) => {
      ;(function recSubTodosComplete(subTodos) {
        if (subTodos.length == 0) return

        subTodos.forEach(id => {
          const subTodos = state.todos[id].subTodos;

          completeTodo(state, {complete: payload.complete, id: id});
          recSubTodosComplete(subTodos);
        });
      })(payload.subTodos);
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
    REMOVE_TODO_FROM_LIST: (state, id) => {
      if (state.todoList.includes(id)) {
        const ind = state.todoList.indexOf(id);

        if (ind > -1) {
          state.todoList.splice(ind, 1);
        }
      }
    },
    REMOVE_TODO_FROM_PARENT: (state, id) => {
      const todo = state.todos[id];

      if (todo.parentTodo !== null) {
        const ind = state.todos[todo.parentTodo].subTodos.indexOf(id);

        if (ind > -1) {
          state.todos[todo.parentTodo].subTodos.splice(ind, 1);
        }
      }
    },
    REMOVE_TODO: (state, id) => {
      const todo = state.todos[id];

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
    OPEN_MODAL: (state, id) => {
      state.modalTodo = id;
    },
    CLOSE_MODAL: (state) => {
      state.modalTodo = null;
    }
  },
  actions: {
    createTodo: (context, params) => {
      const newTodo = new Todo(params);
      const id = context.state.todoIdCounter;
      newTodo.id = id;

      context.commit('INC_TODO_ID_COUNTER');
      context.commit('CREATE_TODO', newTodo);

      if (params.parentTodo === null) {
        context.commit('ADD_TODO_TO_LIST', id);
      } else if (Number.isInteger(params.parentTodo)) {
        context.commit('ADD_TODO_TO_SUBTODOS', { id: id, toId: params.parentTodo });
        context.commit('CHECK_COMPLETE_TODOS_PARENTS', { parentId: params.parentTodo });
      }

      if (params.edit) {
        context.commit('SET_EDITING', id);
      }
    },
    editTodo: (context, todo) => {
      context.commit('EDIT_TODO', todo);
    },
    removeTodo: (context, id) => {
      const todo = context.state.todos[id];

      if (todo.parentTodo !== null) {
        context.commit('REMOVE_TODO_FROM_PARENT', id);
        store.commit('CHECK_COMPLETE_TODOS_PARENTS', {parentId: todo.parentTodo});
      } else {
        context.commit('REMOVE_TODO_FROM_LIST', id);
      }

      context.commit('REMOVE_TODO', id);
    },
    removeAll: (context) => {
      context.commit('REMOVE_ALL');
    },
    completeTodo: (context, params) => {
      context.commit('COMPLETE_TODO', params);

      const subTodos = context.state.todos[params.id].subTodos;

      if (subTodos.length > 0) {
        context.commit('COMPLETE_SUBTODOS', {subTodos, complete: params.complete});
      }

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

      if (params.parent !== undefined)
        context.commit('CHECK_COMPLETE_TODOS_PARENTS', {parentId: params.parent});
    },
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
    todoParent: (state) => (id) => {
      const parent = state.todos[id].parentTodo;

      if (parent === null) return;

      return state.todos[parent]
    },
    hasSubTodos: (state) => (id) => {
      return state.todos[id].subTodos.length > 0
    },
  },
  plugins: [createPersistedState()]
});

export default store;
