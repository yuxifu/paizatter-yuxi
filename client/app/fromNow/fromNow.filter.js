'use strict';
const angular = require('angular');
var moment = require("moment");

/*@ngInject*/
export function fromNowFilter() {
  return function(input) {
    //return `fromNow filter: ${input}`;
    return moment(input).fromNow();
  };
}

export default angular.module('paizatterYuxiApp.fromNow', [])
  .filter('fromNow', fromNowFilter)
  .name;
