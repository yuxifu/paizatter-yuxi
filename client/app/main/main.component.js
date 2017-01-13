import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';
var _ = require('lodash');

export class MainController {
  awesomeThings = [];
  newThing = '';
  busy = true;
  noMoreData = false;

  /*@ngInject*/
  constructor($http, $scope, $location, socket, Auth) {
    this.$http = $http;
    this.$location = $location;
    this.socket = socket;
    this.Auth = Auth;

    $scope.isLoggedIn = Auth.isLoggedInSync;
    $scope.getCurrentUser = Auth.getCurrentUserSync;

    $scope.isMyTweet = function(thing) {
      return Auth.isLoggedInSync() &&
        thing.user &&
        thing.user._id === Auth.getCurrentUserSync()._id;
    };

    $scope.isMyStar = function(thing) {
      var isMine = Auth.isLoggedInSync() && thing.stars && thing.stars.indexOf(Auth.getCurrentUserSync()._id) !== -1;
      return isMine;
    };

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {
    var keyword = this.$location.search().keyword;
    if (keyword) {
      this.query = _.merge(this.query, {
        $text: {
          $search: keyword
        }
      });
    }
    this.$http.get('/api/things', {
        params: {
          query: this.query
        }
      })
      .then(response => {
        this.awesomeThings = response.data;
        this.socket.syncUpdates('thing', this.awesomeThings);
        if (this.awesomeThings.length < 10) {
          this.noMoreData = true;
        }
        this.busy = false;
      });
  }

  nextPage = function() {
    if (this.busy) {
      return;
    }
    this.busy = true;
    var lastId = this.awesomeThings[this.awesomeThings.length - 1]._id;
    //load next page
    var pageQuery = _.merge(this.query, {
      _id: {
        $lt: lastId
      }
    });
    this.$http.get('/api/things', {
      params: {
        query: pageQuery
      }
    }).then(function(response) {
      this.awesomeThings = this.awesomeThings.concat(response.data);
      this.busy = false;
      if (response.data.length === 0) {
        this.noMoreData = true;
      }
    }.bind(this));
  }

  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', {
        name: this.newThing
      });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`);
  }

  starThing = function(thing) {
    var self = this;
    this.$http.put('/api/things/' + thing._id + '/star')
      .then(
        function(response) {
          // success callback
          console.log(thing.name + " staring OK");
          if (self.awesomeThings) {
            self.awesomeThings[self.awesomeThings.indexOf(thing)] = response.data;
          }
        },
        function(response) {
          // failure callback
          console.log(thing.name + " staring failed");
        }
      );
  }

  unstarThing = function(thing) {
    var self = this;
    this.$http.delete('/api/things/' + thing._id + '/unstar')
      .then(
        function(response) {
          // success callback
          console.log(thing.name + " unstaring OK");
          self.awesomeThings[self.awesomeThings.indexOf(thing)] = response.data;
        },
        function(response) {
          // failure callback
          console.log(thing.name + " staring failed");
        }
      );
  }

}

export default angular.module('paizatterApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    bindings: {
      query: "<"
    },
    controller: MainController
  })
  .name;
