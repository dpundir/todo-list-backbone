/*global define*/

define([
    'underscore',
    'backbone',
    'localstorage',
    'models/TodoModel'
], function (_, Backbone, localStorage, TodoModel) {
    'use strict';

    var TodoCollection = Backbone.Collection.extend({
        localStorage: new Backbone.LocalStorage('backbone-todos'),
        
        initialize: function () {
            this.model = TodoModel;
        }        
    });

    return TodoCollection;
});
