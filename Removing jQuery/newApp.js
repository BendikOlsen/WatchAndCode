/*global jQuery, Handlebars, Router */
jQuery(function ($) {  // Executes code when DOM is ready. 
	'use strict';    // Invoking strict mode to the overlying function and everything inside it. Strict mode can optimize the code and make the application run faster. 

	Handlebars.registerHelper('eq', function (a, b, options) {  //  note to self. Read up on handlebars and watch video
		return a === b ? options.fn(this) : options.inverse(this);
	});

	var ENTER_KEY = 13;  // Binding the variable ENTER_KEY to 13 which is the key code for enter on keyboards
	var ESCAPE_KEY = 27;  //  Binding the variable ESCAPE_KEY to 13, which is the key code for escape. 

	var util = {  //  Generates a random id on 32 random numbers. 
		uuid: function () {
			/*jshint bitwise:false */
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
			}

			return uuid; // return the uuid so it's accessible outside the funciton
		},
		pluralize: function (count, word) { // If there are more items then 1 or 0 items, the text in the footer will pluralize item to items. 
			return count === 1 ? word : word + 's';
		},
		store: function (namespace, data) {   // function to store the data locally on the machine. It takes two arguments, namespace and data.
			if (arguments.length > 1) {      //  If theres arguemnts in the store method it will run return setItem()
				return localStorage.setItem(namespace, JSON.stringify(data));  //setItem() is a method namespace and JSON.stringify(data) to the Storage object.
			} else {
				var store = localStorage.getItem(namespace);  //  if the arguments i less than 1, it runs getItem(), which returns the key names?? value or null to the storage object. 
				return (store && JSON.parse(store)) || [];  //  returns the arguments that were used in the store method as objects and as string. 
			}
		}
	};

	var App = {    //  this object contain the main methods of the application. 
		init: function () {
			this.todos = util.store('todos-jquery');  //  todo-array is equal to the stored todos from the store-method.
			this.todoTemplate = Handlebars.compile($('#todo-template').html());  //  note to self. Read up on handlebars and watch video
			this.footerTemplate = Handlebars.compile($('#footer-template').html());
			this.bindEvents();

      new Router({  //  Note to self. Rewatch last video in the Reading section
				'/:filter': function (filter) {
					this.filter = filter;
					this.render();
				}.bind(this)
			}).init('/all');      
		},
		bindEvents: function () {  //  function for binding event to certain user actions
			$('#new-todo').on('keyup', this.create.bind(this));  //  Bind the create method on actions where you release keyboard keys in the new todo field
			$('#toggle-all').on('change', this.toggleAll.bind(this));
			$('#footer').on('click', '#clear-completed', this.destroyCompleted.bind(this));
			$('#todo-list')
				.on('change', '.toggle', this.toggle.bind(this))
				.on('dblclick', 'label', this.edit.bind(this))
				.on('keyup', '.edit', this.editKeyup.bind(this))
				.on('focusout', '.edit', this.update.bind(this))
				.on('click', '.destroy', this.destroy.bind(this));
		},
		render: function () {
			var todos = this.getFilteredTodos();
			$('#todo-list').html(this.todoTemplate(todos));
			$('#main').toggle(todos.length > 0);
			$('#toggle-all').prop('checked', this.getActiveTodos().length === 0);
			this.renderFooter();
			$('#new-todo').focus();
			util.store('todos-jquery', this.todos);
		},
		renderFooter: function () {  //  function to render interface below the main todo window. 
			var todoCount = this.todos.length;  // counting the total amount of todos
			var activeTodoCount = this.getActiveTodos().length;  //  calling the getActiveTodos method and checking the lenght of the activeTodo array. 
			var template = this.footerTemplate({  //  object storing the name : value pairs in the footer template. 
				activeTodoCount: activeTodoCount,  //  activeTodoCount(name) : the activeTodoCount(value) variable. -> this.getActiveTodos().length
				activeTodoWord: util.pluralize(activeTodoCount, 'item'),  //  activeTodoWord (name) : util.pluralize (value) -> 
				completedTodos: todoCount - activeTodoCount,  //  completedTodos(name) : todoCount - activeTodoCount(value) -> getting the amount of completedTodos by subtracting activeTodos from the total amount of todos. 
				filter: this.filter
			});

			$('#footer').toggle(todoCount > 0).html(template);
		},
		toggleAll: function (e) {  // method for toggling all the todos.
			var isChecked = $(e.target).prop('checked');  //  variable used to see which todos are checked

			this.todos.forEach(function (todo) {  //  forEach, looping through every todo, if the todo is completed thay are also chcked. 
				todo.completed = isChecked;
			});

			this.render();
		},
		getActiveTodos: function () {  //  method returning the todos that are not completed. 
			return this.todos.filter(function (todo) {  // .filter creates a new array with the elements that are not completed
				return !todo.completed;  // returns the uncompleted todos
			});
		},
		getCompletedTodos: function () {  // method returning the todos that are completed
			return this.todos.filter(function (todo) {  //  .filter creates a new array with the elements that are completed
				return todo.completed;  // returns completed todos 
			});
		},
		getFilteredTodos: function () {  // method filtering out active and completed todos for the render method.
			if (this.filter === 'active') {  //  making a new array with the active todos
				return this.getActiveTodos();  //  returning the new array with active todos
			}

			if (this.filter === 'completed') {  //  making a new array with completed todos
				return this.getCompletedTodos();  //  returning the completed todos
			}

			return this.todos;
		},
		destroyCompleted: function () {  //  method for only showing the active todos, and this way indirectly removing the completed ones. 
			this.todos = this.getActiveTodos();
			this.filter = 'all';  //  filter the array of active todos to the 'all' router
			this.render();  //  end of method.
		},
		// accepts an element from inside the `.item` div and
		// returns the corresponding index in the `todos` array
		indexFromEl: function (el) {  //  method for getting the id of the todos
			var id = el.closest('li').getAttribute('data-id'); // Id takes the closest ancestors to el which matches li. 
			var todos = this.todos;  //  
			var i = todos.length;  //  i is equal to the length of the todos array.

			while (i--) {  //  looping through the array as long as its more than 0 
				if (todos[i].id === id) {  //  fetching the id of the todos you are looping, if its equal to id
					return i;
				}
			}
		},
		create: function (e) {  //  method for creating todos
			var input = e.target;  //  originally var input = $(e.target);
      var val = input.value.trim();  //  orignally var val = $input.val().trim();

			if (e.which !== ENTER_KEY || !val) {  //  if theres not event of pressing the enter key nor value in the input form(html) nothing is returned
				return;
			}

			this.todos.push({  //  pushing the todo from the input onto the array
				id: util.uuid(),  //  run the uuid(random id generator) on the id
				title: val,  //  title is the input value
				completed: false  // by default the todos are not completed
			});

			input.value =  '';  //  clears the input field 

			this.render();  //  run the render method - the li with the todo will appear on the page.
		},
		toggle: function (e) {  //  method for toggling a selected todo
			var i = this.indexFromEl(e.target);  //  getting the position of the toggled todo
			this.todos[i].completed = !this.todos[i].completed;  //  todos completed is now todos not completed
			this.render();  //  run the render method - the change will no appear on the page
		},
		edit: function (e) {  //  method for editing todos
			var todoLi = e.target.closest('li');  //  targeteting the li where the event happened and adding class to that element.
      todoLi.classList.add('editing');  //  adding class .editing to the selected todo
      var input = todoLi.querySelector('.edit');  //  selecting the edit class 
      var tmpStr = input.value;  // adding temporary string 
      input.value = '';  //  clearing the input field
      input.value = tmpStr;  //  adding the old value from tmpStr
      input.focus();  //  cursor is now at the end of the input field
  
		},
		editKeyup: function (e) {
			if (e.which === ENTER_KEY) {
				e.target.blur();
			}

			if (e.which === ESCAPE_KEY) {
        var giveAbortAtt = e.target;
        giveAbortAtt.addEventListener('abort', this.edit.input);
				giveAbortAtt.blur();
			}
		},
		update: function (e) {
			var el = e.target;
			var $el = $(el);
			var val = $el.val().trim();

			if (!val) {
				this.destroy(e);
				return;
			}

			if ($el.data('abort')) {
				$el.data('abort', false);
			} else {
				this.todos[this.indexFromEl(el)].title = val;
			}

			this.render();
		},
		destroy: function (e) {
			this.todos.splice(this.indexFromEl(e.target), 1);
			this.render();
		}
	};

	App.init(); //  Initiates the app object when the sites load?
});