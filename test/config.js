'use strict';

/**
 * example configuration file for koa-rr
 * this module will export a list of routes, all the keys are required
 */

function fooGen(i) {
  return function* foo() {/*jshint noyield:true */
    this.body = 'foo' + i;
  };
}


module.exports = [

  {
    /**
     * Route name, unique
     * @type {String}
     */
    name: 'index',
    
    /**
     * Route url (with optional params placeholders)
     * @type {String}
     */
    url: '/',
    
    /**
     * HTTP method or "any"
     * @type {String}
     */
    method: 'get',
    
    /**
     * Handler for this route
     * @type  {function}
     */
    controller: function* () {/*jshint noyield:true */ this.body = 'foo1'; }
  },
  
  
  { name: 'blog', url: '/blog', method: 'get', controller: fooGen(2) },
  { name: 'post', url: '/post/:slug', method: 'get', controller: fooGen(2) },
  { name: 'post-with-cat', url: '/post/:category/:slug', method: 'get', controller: fooGen(2) }

];
