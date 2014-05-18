/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/TodoView',
    'models/TodoModel'
], function ($, _, Backbone, JST, TodoView, TodoModel) {
    'use strict';

    var TodosView = Backbone.View.extend({
        template: JST['app/scripts/templates/todos.ejs'],

        el: '#todo-app',

        id: '',        

        className: '',

        events: {
            'submit': 'createTodo',
            'click .filter': 'toggleFilter',
            'click #see-archive': 'loadArchive',
            'click #do-archive': 'doArchive',
            'change select[id="completedFilter"]': 'completedFilter',
            'keyup input[id="titleFilter"]': 'titleFilter',
            'change input[id="dateFilter"]': 'dateFilter',
            'change select[id="priorityFilter"]': 'priorityFilter'
        },

        initialize: function (options) {
            _.bindAll(this, 'showArchive');
            this.archive = options.archive;
            this.render(options);
            
            this.listenTo(this.collection, 'add', this.addTodoItem);
            this.listenTo(this.collection, 'remove', this.removeTodoItem);
            this.listenTo(this.collection, 'reset', this.addAllTodoItems);
            
            this.collection.fetch();
        },

        render: function (options) {
            this.$el.html(this.template());
            
            this.$el.find( "#dateFilter" ).datepicker();

            return this;
        },

        createTodo: function (event) {
            event.preventDefault();

            var title = this.$('#new-todo').val().trim();

            if (title) {
                this.collection.create(new TodoModel({
                    title: title,
                    date: new Date(),
                    completed: false,
                    priority: '4'
                }));

                $('#new-todo').val('');
            }
        },
        
        addTodoItem: function (todo) {
            var view = new TodoView({ model: todo });
            this.$('ul[id="todos"]').append(view.render().el);
        },

        addAllTodoItems: function () {
            this.collection.each(this.addTodoItem, this);
        },
        
        addArchiveTodoItem: function (todo) {
            var view = new TodoView({ model: todo });
            this.$('ul[id="archiveTodos"]').append(view.render().el);
        },
        
        removeTodoItem: function (todos) {
            if(_.isArray(todos)){
                _.each(todos, function(todo){
                    this.$('li[id='+todo.get('id')+']').remove();
                    todo.destroy();
                }, this);
            } else{
                this.$('li[id='+todos.get('id')+']').remove();
                todos.destroy();
            }
        },
        
        toggleFilter: function(event){
            this.$('.todo-filter').toggleClass('showFilter');
        },
        
        completedFilter: function(event){
            this.filterData('completed', event.currentTarget.value)
        },
        
        titleFilter: function(event){
            this.filterData('title', event.currentTarget.value)
        },
        
        dateFilter: function(event){
            this.filterData('date', event.currentTarget.value)
        },
        
        priorityFilter: function(event){
            this.filterData('priority', event.currentTarget.value);
        },
        
        filterData: function(type, value){
            
            this.resetFilterData(type);
            
            var todosVisible = !this.$el.find('#todos').hasClass('hideTodos');
            this.$el.find('li').removeClass('hide-todo-list');
            if((type === 'completed' || type === 'priority') && value === '-1'){
                return;
            }
            var filteringContainer = this.$el.find('#archiveTodos');
            var filteringContainerData = this.archive;
            if(todosVisible){
                filteringContainer = this.$el.find('#todos');
                filteringContainerData = this.collection;
            }
            
            var typeName = type;
            var filteredData = [];
            var selector = '';
            var selectorType = 'inpur';

            if(type === 'completed'){
                filteredData = filteringContainerData.where({'completed': value === 'true'});
            } else if(type === 'title'){
                filteredData = filteringContainerData.whereString({'title': value}, {'startsWith': true});
            } else if(type === 'date'){
                filteredData = filteringContainerData.where({'dateString': value});
            } else if(type === 'priority'){
                filteredData = filteringContainerData.where({'priority': value});
            }

            _.each(filteredData, function(data){
                selector = selector? selector + ',[id="'+data.id+'"]' : '[id="'+data.id+'"]';
            }, this);

            filteringContainer.find('li:not('+selector+')').addClass('hide-todo-list');
        },
        
        resetFilterData: function(type){
            if(type === 'completed'){
                this.$el.find('[id="titleFilter"]').val('');
                this.$el.find('[id="dateFilter"]').val('');
                this.$el.find('[id="priorityFilter"]').val('-1');
            } else if(type === 'title'){
                this.$el.find('[id="completedFilter"]').val('-1');
                this.$el.find('[id="dateFilter"]').val('');
                this.$el.find('[id="priorityFilter"]').val('-1');
            } else if(type === 'date'){
                this.$el.find('[id="completedFilter"]').val('-1');
                this.$el.find('[id="titleFilter"]').val('');
                this.$el.find('[id="priorityFilter"]').val('-1');
            } else if(type === 'priority'){
                this.$el.find('[id="completedFilter"]').val('-1');
                this.$el.find('[id="titleFilter"]').val('');
                this.$el.find('[id="dateFilter"]').val('');
            }            
        },
        
        loadArchive: function(event){
            var seeArchiveText = this.$('#see-archive').html();
            this.$el.find('#todos').toggleClass('hideTodos');
            this.$el.find('#archiveTodos').toggleClass('hideArchive');
            this.$('#do-archive').toggleClass('disable-link');
            
            if(seeArchiveText !== 'Hide Archive'){
                this.$('#see-archive').html('Hide Archive');
                this.$('#do-archive').attr('disabled', 'disabled');
                
                this.archive.fetch({'success': this.showArchive});
            }
            else{
                this.$('#do-archive').removeAttr('disabled');
                this.$('#see-archive').html('Show Archive');
            }
        },
        
        showArchive : function(collection, response, options){
            this.$('ul[id="archiveTodos"]').empty();
            
            _.each(collection.models, function(todo){
                this.addArchiveTodoItem(todo);
            }, this);
        },
        
        doArchive: function(){
            var archiveDisabled = this.$('#do-archive').attr('disabled');
            if(archiveDisabled !== 'disabled'){
                var completedTodos = this.collection.where({'completed': true});
                completedTodos = this.collection.remove(completedTodos);

                _.each(completedTodos, function(todo){
                    this.archive.create(new TodoModel({
                        id: todo.get('id'),
                        title: todo.get('title'),
                        date: todo.get('date'),
                        dateString: todo.get('dateString'),
                        completed: todo.get('completed'),
                        priority: todo.get('priority')
                    }));
                }, this);
            }
        }
    });

    return TodosView;
});
