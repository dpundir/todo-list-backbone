/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var TodoModel = Backbone.Model.extend({
        url: '',

        initialize: function() {
        },

        defaults: {
            title: '',
            completed: false,
            priority: '4',
            date: '',
            dateString: ''
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            var dt = new Date(response.date);
            var month = dt.getMonth();
            var date = dt.getDate();
            var year = dt.getFullYear();
            
            month = month + 1;
            month = month < 10? '0' + month : month;
            
            date = date < 10? '0' + date : date;
            
            response.dateString = month + '/' + date + '/' + year;
            return response;
        },

        toggle: function () {
            this.save({
                completed: !this.get('completed')
            });
        }
    });

    return TodoModel;
});
