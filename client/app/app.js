'use strict';

angular.module('untitled1App', ['untitled1App.auth', 'untitled1App.admin', 'untitled1App.constants',
    'ngCookies', 'ngResource', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'validation.match','ngMaterial','ngMessages','ngLodash'
  ])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });
