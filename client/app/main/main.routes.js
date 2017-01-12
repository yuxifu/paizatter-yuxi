'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('main', {
      url: '/',
      template: '<main query="routeController.query"></main>',
      controllerAs: "routeController",
      controller: function(query) {
        const routeController = this;
        routeController.query = query;
      },
      resolve: {
        query: function() {
          return null;
        }
      }
    })
    .state('starred', {
      url: '/users/:userId/starred',
      template: '<main query="routeController.query"></main>',
      controllerAs: "routeController",
      controller: function(query) {
        const routeController = this;
        routeController.query = query;
      },
      resolve: {
        query: function($stateParams) {
          return {
            stars: $stateParams.userId
          };
        }
      }
    })
    .state('user', {
      url: '/users/:userId',
      template: '<main query="routeController.query"></main>',
      controllerAs: "routeController",
      controller: function(query) {
        const routeController = this;
        routeController.query = query;
      },
      resolve: {
        query: function($stateParams, $state) {
            //console.log($state);
            //console.log($stateParams);
          return {
            user: $stateParams.userId
          };
        }
      }
    })

    //
}
