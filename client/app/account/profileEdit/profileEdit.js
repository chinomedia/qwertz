angular.module('untitled1App')
  .config(function($stateProvider) {
    $stateProvider
      .state('/profileEdit', {
        url:'/profileEdit/:profileId',
        templateUrl: 'app/account/profileEdit/profile.html',
        controller: 'ProfileEditController',
        controllerAs: 'vm',
        resolve: {
          profile: function ($stateParams, $http, $q){
            var defer = $q.defer();
            $http.get('/api/profiles/'+$stateParams.profileId).then(
              function successCallback(response) {
                defer.resolve(response);

              }, function errorCallback(response) {
                defer.reject(response);
              });
            return defer.promise;
          }

        }
      });
  });
