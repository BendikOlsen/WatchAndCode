var todoList = {                                        //object for todos array
  todos: [],      
  displayTodos: function() {                            //method for displaying todos
    if (this.todos.length === 0){                       //if this.todos length is equal to === 0
         console.log ('Your todo list is emty!')
    } else {
       console.log('My Todos');
       for (var i = 0; i < this.todos.length; i++){     //for loop for displaying Todos
        console.log(this.todos[i].todoText);
         
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
  toggleCompleted: function(position){
    var todo = this.todos[position];
    todo.completed = !todo.completed;
    this.displayTodos();
  },
  toggleAll: function(){                               //Toggle all todos     
    var totalTodos = this.todos.length;
    var completedTodos = 0;
    for (var i = 0; i < totalTodos; i++){               //Get number of completed todos.
      if (this.todos[i].completed === true) {
        completedTodos++;
      }
    }
    
     if (completedTodos === totalTodos) {               //if everything's true, make everything false.                                                        //Make everything false.
        for (var i = 0; i < totalTodos; i++){
         this.todos[i].completed = false;
        }
        // Otherwise, make everything true
        }else{
          for (var i = 0; i < totalTodos; i++) {
            this.todos[i].completed = true;
          }
        }
      
      this.displayTodos();
    }
};