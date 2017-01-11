import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor($http, $scope, socket, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.Auth = Auth;

    $scope.isLoggedIn = Auth.isLoggedInSync;
    $scope.getCurrentUser = Auth.getCurrentUserSync;
    $scope.isMyTweet = function(thing) {
      return Auth.isLoggedInSync()
          && thing.user
          && thing.user._id === Auth.getCurrentUserSync()._id;
    };

    $scope.isMyStar = function(thing){
        var isMine = Auth.isLoggedInSync() && thing.stars && thing.stars.indexOf(Auth.getCurrentUserSync()._id)!==-1;
        //console.log(thing.name     + " is mine:  " + isMine);
        return isMine;
    };

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {
    this.$http.get('/api/things')
      .then(response => {
        this.awesomeThings = response.data;
        this.socket.syncUpdates('thing', this.awesomeThings);
      });
  }

  addThing() {
    if(this.newThing) {
      this.$http.post('/api/things', {
        name: this.newThing
      });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`);
  }

  starThing = function(thing, awesomeThings) {
      console.log(thing.name + " staring by " + this.Auth.getCurrentUserSync().email);
      console.log("this before staring: "     + this);
      this.$http.put('/api/things/' + thing._id + '/star')
        .then(
            function(response){
                // success callback
                console.log(thing.name     + " staring OK");
                console.log(response);
                if(awesomeThings){
                    console.log("awesomeThings: "     + awesomeThings);
                    awesomeThings[awesomeThings.indexOf(thing)] = response.data;
                }
            },
            function(response){
                // failure callback
                console.log(thing.name     + " staring failed");
            }
        );
  }

  unstarThing = function(thing, awesomeThings) {
      this.$http.delete('/api/things/' + thing._id + '/unstar')
        .then(
            function(response){
                // success callback
                console.log(thing.name     + " unstaring OK");
                awesomeThings[awesomeThings.indexOf(thing)] = response.data;
            },
            function(response){
                // failure callback
                console.log(thing.name     + " staring failed");
            }
        );
        //.success(function(newthing){
        //$scope.awesomeThings[$scope.awesomeThings.indexOf(thing)] = newthing;
        //});
  }

}

export default angular.module('paizatterApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
