'use strict';

var assert = require('assert');
var debug = require('debug')('koa-rr');
var pathToRegexp = require('path-to-regexp');
var _ = require('lodash');

var PARAM_MARKER = ':';

module.exports = Rr;

function Rr(app, router) {
  assert(typeof app !== 'undefined', 'Expected parameter: app');
  
  this.app = app;
  this.table = {};
  
  if (router) {
    this.router = router;
  } else {
    debug('Requiring koa-route');
    this.router = require('koa-route');
  }
  
}


Rr.prototype.getRouter = function() {
  return this.router;
};


Rr.prototype.configure = function(config_) {
  
  config_.forEach(function addRoute(route, index) {
    var name = route.name;
    var method = route.method.toLowerCase();
    var url = route.url;
    var controller = route.controller;
    
    assert(this.router.hasOwnProperty(method), 'Invalid HTTP method ' + method);
    debug('Adding route %s: %s %s', name, method, url);
    
    // add this route to the app
    this.app.use(this.router[method].call(this.router, url, controller));
    
    // add this route to the table
    assert(name, 'Missing route name at index ' + index);
    assert(!this.table.hasOwnProperty(name), 'Duplicate route name ' + name);
    this.table[name] = url;
    
  }.bind(this));
  
};


Rr.prototype.reverse = function(name, obj) {
  debug('Finding reverse for route %s', name);
  
  assert(typeof obj === 'object' || typeof obj === 'undefined', 'Second parameter to Rr.reverse should be an object or undefined, not ' + typeof obj);
  
  var urlPattern = this.table[name];
  assert(typeof urlPattern !== 'undefined', 'No route found with name ' + name);
  
  var keys = [];
  pathToRegexp(urlPattern, keys);
  debug('%d props in url', keys.length);
  
  keys = _.pluck(keys, 'name');
  keys.forEach(function (name) {
    assert(typeof obj === 'object', 'Second parameter to Rr.reverse should be an object when reversing a url with params.');
    assert(obj.hasOwnProperty(name), 'Second parameter to Rr.reverse should contain a property named "' + name + '". It does not.');
    assert(typeof obj[name] === 'string', 'Second parameter to Rr.reverse should contain a string property named "' + name + '". It is not a string.');
    
    debug('Replacing prop with name %s', name);
    urlPattern = urlPattern.replace(PARAM_MARKER + name, obj[name]);
  });
  
  return urlPattern;
};
