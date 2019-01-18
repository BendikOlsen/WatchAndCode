/* 
todoList.addTodo should add objects
todoList.changeTodo should change the todoText property
todoList.toggleCompleted should change the compelted property
*/

// -- My own "blind" try --
// var todoList = {
//   todos: {
//     nameOfTodo : [],
//     completedTodo : false
//   },

//   displayTodos: function()  {
//     console.log(this.todos);
//   },

//   addTodo:  function(todo)  {
//     this.todos.nameOfTodo.push(todo);
//     this.displayTodos();
//   }
// };

var todoList = {
  todos: [],
  displayTodos: function () {
    console.log('My todos', this.todos);
  },
  addTodos: function (todoText) {
    this.todos.push({
      todoText: todoText,
      completed: true
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
  // this.todos[position].completed = true;   // my own take on it
  // this.displayTodos();
  toggleCompleted: function (position) {
    var todo = this.todos[position];
    todo.completed = !todo.completed;
    this.displayTodos();
  }
};