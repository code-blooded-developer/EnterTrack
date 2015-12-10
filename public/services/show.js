angular.module('MyApp')
.factory('Movie', function($resource) {
    return $resource('/api/movies/:_id');
  });
