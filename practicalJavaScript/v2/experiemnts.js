var todos = ['item 1', 'item 2', 'item 3']

var objTodos = {
  name : 'item 1',
  name : 'items 2',
  name : 'item 3'
};

function displayTodos() {
  console.log('My todos: ', todos);
  console.log('My todosObj: ', objTodos);
};

todos.forEach(function(el) {
  console.log('My todos: ' + el);
})

// displayTodos();

function stringyFyTodos() {
  var stringTodos = JSON.stringify(todos)
  
  return stringTodos;
};

// stringyFyTodos();