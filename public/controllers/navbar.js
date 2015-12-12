var app = angular.module('MyApp');

app.controller('NavbarCtrl', function($scope, Auth,Movie) {
    $scope.logout = function() {
      Auth.logout();
    };

    $scope.movies = Movie.query();
    $scope.search = [];

    angular.forEach($scope.movies, function(value, key) {
      if(key === 'name'){
        search.push(value);  
      }
    });

  });
