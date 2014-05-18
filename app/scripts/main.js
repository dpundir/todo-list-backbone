/*global require*/
'use strict';

require.config({
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        jqueryui: {
            deps: ['jquery']
        }
    },
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        jqueryui: '../bower_components/jquery-ui/ui/jquery-ui',
        backbone: '../bower_components/backbone/backbone',
        localstorage: '../bower_components/backbone.localStorage/backbone.localStorage',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: '../bower_components/sass-bootstrap/dist/js/bootstrap'
    }
});

require([
    'backbone',
    'views/TodosView',
    'collections/TodoCollection',
    'collections/TodoArchiveCollection'
], function (Backbone, TodosView, TodoCollection, TodoArchiveCollection) {
    Backbone.history.start();
    
    Date.prototype.formatMMDDYYYY = function(){
        return this.getMonth() + 
        "/" +  this.getDate() +
        "/" +  this.getFullYear();
    };
    
    if (typeof String.prototype.startsWith != 'function') {
      // see below for better implementation!
      String.prototype.startsWith = function (str){
        return this.indexOf(str) == 0;
      };
    }
    
    Backbone.Collection.prototype.whereString = function(attrs, options, first) {
      if (_.isEmpty(attrs)) return first ? void 0 : [];
      return this[first ? 'find' : 'filter'](function(model) {
        for (var key in attrs) {
            if(options.startsWith){
                return model.get(key).startsWith(attrs[key]);
            }
            else if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    }
    
    $(document).ready(function () {
        new TodosView({
            collection: new TodoCollection(),
            archive: new TodoArchiveCollection()
        });
    });
});
