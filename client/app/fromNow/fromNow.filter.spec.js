'use strict';

describe('Filter: fromNow', function() {
  // load the filter's module
  beforeEach(module('paizatterYuxiApp.fromNow'));

  // initialize a new instance of the filter before each test
  var fromNow;
  beforeEach(inject(function($filter) {
    fromNow = $filter('fromNow');
  }));

  it('return "a few seconds ago" for now', function() {
    expect(fromNow(Date.now())).to.equal('a few seconds ago');
  });
});
