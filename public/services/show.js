var app = angular.module('MyApp');

app.factory('Movie', function($resource) {
    return $resource('/api/movies/:_id');
  });
