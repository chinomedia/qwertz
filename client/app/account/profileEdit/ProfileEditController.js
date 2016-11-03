'use strict';

class ProfileEditController {
  constructor(Auth, $location, $http, $timeout, $q, profile) {
    this.$http = $http;
    //this.profile = {};
    //this.profile.pics = [{},{},{},{},{},{}];

    this.errors = [];
    this.submitted = false;
    this.profile=profile.data;
    this.$q = $q;
    this.tags = [];
    this.isLoggedIn = Auth.isAdmin();
    this.user=  [];
    this.user = Auth.getCurrentUser();

    this.isAllowed = (this.isLoggedIn);
    if(!this.isAllowed){
      $location.path('/');
    }



    this.Auth = Auth;
    this.user = {};
    this.user= this.Auth.getCurrentUser();

    this.$location = $location;
    var promises = [];




  }
  editProfile(form) {
    this.submitted = true;

    if (form.$valid) {

    }
  };

  editProfile() {




    console.log(this.profile.adress);
    this.$http.get('http://maps.google.com/maps/api/geocode/json?address='+this.profile.adress.street+'+'+this.profile.adress.town+'+'+this.profile.adress.postal+'&sensor=false')
      .success((mapData)=> {
      if(mapData.results.length == 0){
      this.errors.push("keine gültige Adresse");
    }
  else{
      this.profile.location = mapData.results[0].geometry.location;
      this.profile.gmap= 'https://www.google.com/maps/place/'+this.profile.adress.street +'/'+this.profile.adress.postal+'/'+this.profile.adress.town;
      console.log(this.profile);
      this.$http.put('/api/profiles/'+this.profile._id, this.profile).success((profile)=> {
        console.log(profile);


    })
    }
  });
    this.newProfile = '';
    this.$location.path('/');

  };

}



angular.module('untitled1App')
  .controller('ProfileEditController', ProfileEditController);
/**
 * Created by Surface on 21.06.2016.
 */
