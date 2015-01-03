'use strict';

var Rr = require('../');
var config = require('./config');
var koa = require('koa');
var test = require('tape');
var app = koa();

var rr = new Rr(app);
rr.configure(config);


test('reverse simple', function (t) {
  t.equal(rr.reverse('index'), '/', 'without parameters');
  t.equal(rr.reverse('blog'), '/blog', 'without parameters (again)');
  t.end();
});
  
test('reverse with property', function (t) {
  t.throws(function () { rr.reverse('post'); }, 'should throw if prop is missing');
  t.throws(function () { rr.reverse('post', {}); }, 'should throw if prop is undefined');
  t.throws(function () { rr.reverse('post', { slug: 123 }); }, 'should throw if prop is not a string');
  t.equal(rr.reverse('post', { slug: 'foo' }), '/post/foo', 'should work');
  t.end();
});
  
test('reverse with many properties', function (t) {
  t.throws(function () { rr.reverse('post-with-cat'); }, 'should throw if prop are missing');
  t.throws(function () { rr.reverse('post-with-cat', { slug: 'foo' }); }, 'should throw if one prop is missing');
  t.equal(rr.reverse('post-with-cat', { slug: 'foo', category: 'bar' }), '/post/bar/foo', 'should work');
  t.end();
});
