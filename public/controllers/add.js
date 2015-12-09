var app =angular.module('MyApp');

app.controller('AddCtrl', function($scope, $alert, Movie) {
    $scope.addMovie = function() {
      Movie.save({ movieName: $scope.movieName }).$promise
        .then(function() {
          $scope.movieName = '';
          $scope.addForm.$setPristine();
          $alert({
            content: 'Movie has been added.',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        })
        .catch(function(response) {
          $scope.movieName = '';
          $scope.addForm.$setPristine();
          $alert({
            content: response.data.message,
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        });
    };
  });