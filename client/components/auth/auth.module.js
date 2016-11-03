'use strict';

angular.module('untitled1App.auth', ['untitled1App.constants', 'untitled1App.util', 'ngCookies',
    'ui.router'
  ])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
