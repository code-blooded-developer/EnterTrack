var app = angular.module('MyApp');

app.controller('DetailCtrl', function($scope, $rootScope, $routeParams, Movie, Subscription) {
      Movie.get({ _id: $routeParams.id }, function(movie) {
        $scope.movie = movie;

        $scope.isSubscribed = function() {
          return $scope.movie.subscribers.indexOf($rootScope.currentUser._id) !== -1;
        };

        $scope.subscribe = function() {
          Subscription.subscribe(movie).success(function() {
            $scope.movie.subscribers.push($rootScope.currentUser._id);
          });
        };

        $scope.unsubscribe = function() {
          Subscription.unsubscribe(movie).success(function() {
            var index = $scope.movie.subscribers.indexOf($rootScope.currentUser._id);
            $scope.movie.subscribers.splice(index, 1);
          });
        };
      });
    });
