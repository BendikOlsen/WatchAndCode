// displayTodos should show .todoText
// displayTodos should tell you if .todos is empty
// displayTodos should show .completed

var todoList = {
  todos: [],
  displayTodos: function () {
    if (this.todos.length === 0) {
      console.log('this array is empty');
    } else {
      console.log('My Todos:')
      for (var i = 0; i < this.todos.length; i++) {
        if (this.todos[i].completed === true) {
          console.log('(X)', this.todos[i].todoText);
      } else {
          console.log('( )', this.todos[i].todoText);
        }
      }
    }
  },
  addTodos: function (todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false
    });
    this.displayTodos();
  },
  changeTodos: function (position, todoText) {
    this.todos[position].todoText = todoText;
    this.displayTodos();
  },
  deleteTodo: function (position) {
    this.todos[position].todoText.splice(position, 1);
    this.displayTodos();
  },
  // toggleCompleted: function(position) {
  toggleCompleted: function (position) {
    var todo = this.todos[position];
    todo.completed = !todo.completed;
    this.displayTodos();
  }
};