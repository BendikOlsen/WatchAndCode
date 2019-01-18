var todoList = {                                        //object for todos array
  todos: [],      
  displayTodos: function() {                            //method for displaying todos
    if (this.todos.length === 0){                       //if this.todos length is equal to === 0
         console.log ('Your todo list is empty!')
    } else {
       console.log('My Todos');
       for (var i = 0; i < this.todos.length; i++){     //for loop for displaying Todos
          if (this.todos[i].completed === true){        //if statement to display () or (x)
            console.log('(x)', this.todos[i].todoText);
         } else {
            console.log('()', this.todos[i].todoText);
         }
            
        }
     }
  },
  
  addTodos: function(todoText) {                        //method for adding todos
    this.todos.push({
      todoText: todoText,
      completed: false
    });
    this.displayTodos();
  },
  changeTodos: function(position, todoText) {           //method for changing todos
    this.todos[position].todoText = todoText;
    this.displayTodos();
  },
  deleteTodos: function(position) {                     //method for deleteing todos
    this.todos.splice(position,1);
    this.displayTodos();
  },
  toggleCompleted: function(position) {                  //method for toggling completed todos
    var todo = this.todos[position];
    todo.completed = !todo.completed;
    this.displayTodos();
  },
  toggleAll: function() {                               //Toggle all todos  
    var totalTodos = this.todos.length;
    var completedTodos = 0;
    for (var i = 0; i < totalTodos; i++) {               //Get number of completed todos.
      if (this.todos[i].completed === true) {
        completedTodos++;
      }
    }
    
     if (completedTodos === totalTodos) {               //if everything's true, make everything false.                                                        
        for (i = 0; i < totalTodos; i++) {
         this.todos[i].completed = false;
        }
        // Otherwise, make everything true
        }else{                                          //Make everything false.
          for (i = 0; i < totalTodos; i++) {
            this.todos[i].completed = true;
          }
        }
      
      this.displayTodos();
    }
};

var handlers = {
  displayTodos: function() {
    todoList.displayTodos();
  },
  toggleAll: function() {
    todoList.toggleAll();
    view.displayTodos();
  },
  addTodo: function() {
    var addTodoTextInput = document.getElementById('addTodoTextInput');
    todoList.addTodos(addTodoTextInput.value);
    addTodoTextInput.value = '';
    view.displayTodos();
  },
  changeTodo: function () {
    var changeTodoPositionInput = document.getElementById('changeTodoPositionInput');
    var changeTodoTextInput = document.getElementById('changeTodoTextInput');
    todoList.changeTodos(changeTodoPositionInput.valueAsNumber,changeTodoTextInput.value);
    changeTodoPositionInput.value = '';
    changeTodoTextInput.value = '';
    view.displayTodos();
  },
  deleteTodo: function () {
    var deleteTodoPositionInput = document.getElementById('deleteTodoPositionInput');
    todoList.deleteTodo(deleteTodoPositionInput.valueAsNumber);
    deleteTodoPositionInput.value = '';
    view.displayTodos();
  },
  toggleCompleted: function () {
    var toggleCompletedPositionInput = document.getElementById('toggleCompletedPositionInput');
    todoList.toggleCompleted(toggleCompletedPositionInput.valueAsNumber);
    toggleCompletedPositionInput.value = '';
    view.displayTodos();
  }
};

var view = {
  displayTodos: function() {
    var todoUl = document.querySelector('ul');
    todoUl.innerHTML = '';
    for (var i = 0; i < todoList.todos.length; i++) {
      var todoLi = document.createElement('li');
      var todo = todoList.todos[i];
      var todoTextWithCompletion = '';
      
      if (todo.completed === true) {
        todoTextWithCompletion = '(x) ' + todo.todoText; 
      } else {
        todoTextWithCompletion = '( ) ' + todo.todoText; 
      }
      
      todoLi.textContent = todoTextWithCompletion;
      todoUl.appendChild(todoLi);
    }
  }
};
