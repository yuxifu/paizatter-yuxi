'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {
  menu = [{
    title: 'Home',
    state: 'main',
    show: true
  }, {
    title: 'Mine',
    state: 'user',
    show: false,
  }, {
    title: 'Starred',
    state: 'starred',
    show: false,
  }, ];

  isCollapsed = true;

  constructor(Auth) {
    'ngInject';

    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;

    this.getCurrentUserId = function() {
      return Auth.getCurrentUserSync()._id;
    }
  }
}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
