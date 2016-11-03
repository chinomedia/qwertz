'use strict';

class NavbarController {
  //end-non-standard

  //start-non-standard
  constructor(Auth, $state) {
    this.isCollapsed = true;
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.reload = function(){
      console.log($state);
      if($state.current.name == 'main'){
        $state.reload();
      }
    }
  }

}

angular.module('untitled1App')
  .controller('NavbarController', NavbarController);
