var todoList = {
  todos: [],
  addTodos: function (todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false
    });
  },
  changeTodos: function (position, todoText) {
    this.todos[position].todoText = todoText;
  },
  deleteTodo: function (position) {
    this.todos.splice(position, 1);
  },
  // toggleCompleted: function(position) {
  toggleCompleted: function (position) {
    var todo = this.todos[position];
    todo.completed = !todo.completed;
  },
  toggleAll: function () {
    var totalTodos = this.todos.length;
    var completedTodos = 0;

    // Get number of completed todos
    this.todos.forEach(function (todo) {
      if (todo.completed === true) {
        completedTodos++;
      }
    });
    this.todos.forEach(function (todo) {
      // Case 1: if everything's true, make everything false. 
      if (completedTodos === totalTodos) {
        todo.completed = false;
      } else {
        // Case 2: Otherwise, make everything true 
        todo.completed = true;
      }
    });
  }
};

var handlers = {
  addTodo: function () {
    var addTodoTextInput = document.getElementById('addTodoTextInput');
    todoList.addTodos(addTodoTextInput.value)
    addTodoTextInput.value = '';
    view.displayTodo();
  },
  changeTodo: function (position, todoText) {
    var changeTodoPositionInput = document.getElementById('changeTodoPositionInput');
    var changeTodoTextInput = document.getElementById('changeTodoTextInput');
    todoList.changeTodos(changeTodoPositionInput.valueAsNumber, changeTodoTextInput.value);
    view.displayTodo();
  },
  deleteTodo: function (position) {
    todoList.deleteTodo(position);
    view.displayTodo();
  },
  toggleCompleted: function () {
    var toggleCompletedPositionInput = document.getElementById('toggleCompletedPositionInput');
    todoList.toggleCompleted(toggleCompletedPositionInput.valueAsNumber);
    toggleCompletedPositionInput.value = '';
    view.displayTodo();
  },
  toggleAll: function () {
    todoList.toggleAll();
    view.displayTodo();
  }
};

var view = {
  displayTodo: function () {
    var todoUl = document.querySelector('ul');
    todoUl.innerHTML = '';

    todoList.todos.forEach(function (todo, position){
      var todoLi = document.createElement('li');
      var todoTextWithCompletion = '';

      if (todo.completed === true) {
        todoTextWithCompletion = '(x) ' + todo.todoText;
      } else {
        todoTextWithCompletion = '( ) ' + todo.todoText;
      };
      todoLi.id = position;
      todoLi.textContent = todoTextWithCompletion;
      todoLi.appendChild(this.createDeleteButton());
      todoUl.appendChild(todoLi);
    }, this)
  },
  createDeleteButton: function () {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteButton';
    return deleteButton;
  },
  setUpEventListeners: function () {
    var todosUl = document.querySelector('ul');
    todosUl.addEventListener('click', function (event) {
      //  Get the element that was clicked on.
      var elementClicked = event.target;

      //  Check if elementClicked is a delete button.
      if (elementClicked.className === 'deleteButton') {
        handlers.deleteTodo(parseInt(elementClicked.parentNode.id));
      }
    });
  }
};
view.setUpEventListeners();

