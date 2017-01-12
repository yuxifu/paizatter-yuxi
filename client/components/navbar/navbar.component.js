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

  constructor($scope, $location, Auth, $state) {
    'ngInject';

    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;

    this.getCurrentUserId = function() {
      return Auth.getCurrentUserSync()._id;
    }

    $scope.search = function(keyword) {
        if ($state.current.controllerAs === 'routeController'){
          $state.go($state.current.name, {keyword: keyword}, {reload: true});
        }else{
          $state.go('main', {keyword: keyword}, {reload: true});
        }
    };

  }
}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
