'use strict';

angular.module('untitled1App')
  .config(function($stateProvider) {
    $stateProvider.state('/learnmore', {
      url: '/learnmore',
      templateUrl: 'app/general/general.html'
    });
  });

