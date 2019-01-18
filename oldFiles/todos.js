var todos = ['items 1', 'items 2', 'item 3', 'item 4']

//function to display todos

function displayTodos(){
    console.log('My todos:',todos);

}



//function to add todos

function addTodos (todo){
    todos.push(todo);
    displayTodos();
}

//function to change todos

function changeTodos(position, newValue){
    todos[position] = newValue;
    displayTodos();
}

//function to delete todos
function deleteTodos(position){
    todos.splice(position, 1);
    displayTodos();
}
