/**
 * Created by Surface on 18.06.2016.
 */
'use strict';

angular.module('untitled1App')
  .directive('car', function() {
    return {
      templateUrl: 'app/main/svg/car.html',
      restrict: 'E',
      scope: false
    };
  });
