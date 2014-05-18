define([
    'jquery',
    'jqueryui',
    'underscore',
    'backbone',
    'templates'
], function ($, $$, _, Backbone, JST) {
    'use strict';

    var TodoView = Backbone.View.extend({

        tagName: 'li',

        template: JST['app/scripts/templates/todo.ejs'],

        events: {
            'click input[type="checkbox"]': 'toggle',
            'change select': 'priorityChange',
            'dblclick span': 'toggleEdit',
            'submit form': 'toggleEdit'
        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {       
            this.$el.attr('id', this.model.get('id'));
            this.$el.html(this.template(this.model.toJSON()));
            var priority = this.$('#priority');
            priority.val(this.model.get('priority'));            

            return this;
        },

        toggle: function () {
            this.model.toggle();
        },

        toggleEdit: function () {
            var input = this.$('form input');
            var title = input.val().trim();
                        
            if (!title) {
                this.model.destroy();
                this.remove();
                return;
            }

            this.$el.toggleClass('editing');

            if (title === this.model.get('title')) {
                // Edit mode.
                input.val(title);
                input.focus();
            } else {
                // Done editing.
                this.model.set('title', title);
                this.model.save();

                this.render();
            }
        },
        
        priorityChange: function(event){
            this.model.set('priority', event.currentTarget.value);
            this.model.save();
        }

    });
    
    return TodoView;
});