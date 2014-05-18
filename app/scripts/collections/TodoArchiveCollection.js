/*global define*/

define([
    'underscore',
    'backbone',
    'localstorage',
    'models/TodoModel'
], function (_, Backbone, localStorage, TodoModel) {
    'use strict';

    var TodoArchiveCollection = Backbone.Collection.extend({
        localStorage: new Backbone.LocalStorage('backbone-todos-archive'),
        
        initialize: function () {
            this.model = TodoModel;
        }        
    });

    return TodoArchiveCollection;
});