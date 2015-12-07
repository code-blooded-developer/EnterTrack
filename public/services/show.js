var app = angular.module('MyApp');

app.factory('Show',['$resource',function($resource){
	return $resource('/api/shows/:id');
}]);