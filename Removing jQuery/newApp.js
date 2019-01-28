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

      new Router({  //  Note to self. Rewatch this video
				'/:filter': function (filter) {
					this.filter = filter;
					this.render();
				}.bind(this)
			}).init('/all');      
		},
		bindEvents: function () {
			$('#new-todo').on('keyup', this.create.bind(this));
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
		renderFooter: function () {
			var todoCount = this.todos.length;
			var activeTodoCount = this.getActiveTodos().length;
			var template = this.footerTemplate({
				activeTodoCount: activeTodoCount,
				activeTodoWord: util.pluralize(activeTodoCount, 'item'),
				completedTodos: todoCount - activeTodoCount,
				filter: this.filter
			});

			$('#footer').toggle(todoCount > 0).html(template);
		},
		toggleAll: function (e) {
			var isChecked = $(e.target).prop('checked');

			this.todos.forEach(function (todo) {
				todo.completed = isChecked;
			});

			this.render();
		},
		getActiveTodos: function () {
			return this.todos.filter(function (todo) {
				return !todo.completed;
			});
		},
		getCompletedTodos: function () {
			return this.todos.filter(function (todo) {
				return todo.completed;
			});
		},
		getFilteredTodos: function () {
			if (this.filter === 'active') {
				return this.getActiveTodos();
			}

			if (this.filter === 'completed') {
				return this.getCompletedTodos();
			}

			return this.todos;
		},
		destroyCompleted: function () {
			this.todos = this.getActiveTodos();
			this.filter = 'all';
			this.render();
		},
		// accepts an element from inside the `.item` div and
		// returns the corresponding index in the `todos` array
		indexFromEl: function (el) {
			var id = el.closest('li').getAttribute('data-id'); // Id takes the closest ancestors to el which matches li. 
			var todos = this.todos;
			var i = todos.length;

			while (i--) {
				if (todos[i].id === id) {
					return i;
				}
			}
		},
		create: function (e) {
			var input = e.target                            //  originally var input = $(e.target);
      var val = input.value.trim();                      //  orignally var val = $input.val().trim();

			if (e.which !== ENTER_KEY || !val) {
				return;
			}

			this.todos.push({
				id: util.uuid(),
				title: val,
				completed: false
			});

			input.value =  '';

			this.render();
		},
		toggle: function (e) {
			var i = this.indexFromEl(e.target);
			this.todos[i].completed = !this.todos[i].completed;
			this.render();
		},
		edit: function (e) {
      var input  =  document.getElementById('#new-todo');
			var input = $(e.target).closest('li').addClass('editing').find('.edit');
			input.val(input.val()).focus();
		},
		editKeyup: function (e) {
			if (e.which === ENTER_KEY) {
				e.target.blur();
			}

			if (e.which === ESCAPE_KEY) {
				$(e.target).data('abort', true).blur();
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