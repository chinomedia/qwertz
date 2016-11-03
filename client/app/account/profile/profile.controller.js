'use strict';

class ProfileController {
  constructor(Auth, $location, $http, $timeout, $q) {
    this.$http = $http;
    //this.profile = {};
    //this.profile.pics = [{},{},{},{},{},{}];

    this.errors = [];
    this.submitted = false;
    this.profile={};
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



    this.profile = {
      adress: {}

    };


  }
  editProfile(form) {
    this.submitted = true;

    if (form.$valid) {

    }
  };

  addProfile() {

    //var length= Object.keys(this.profile.pics).length;


    console.log(this.profile.adress);
    this.$http.get('http://maps.google.com/maps/api/geocode/json?address='+this.profile.adress.street+'+'+this.profile.adress.town+'+'+this.profile.adress.postal+'&sensor=false')
      .success((mapData)=> {
      if(mapData.results.length == 0){
      this.errors.push("keine gültige Adresse");
    }
  else{
      this.profile.location = mapData.results[0].geometry.location;
      console.log(this.profile);
      this.$http.post('/api/profiles', {
        name: this.profile.name,
        info: this.profile.description,
        location: this.profile.location,
        adress: this.profile.adress,
        email: this.profile.email,
        phone: this.profile.phone,
        distance:{value:0},
        gmap: 'https://www.google.com/maps/place/'+this.profile.adress.street +'/'+this.profile.adress.postal+'/'+this.profile.adress.town
      }).success((profile)=> {
        console.log(profile);


    })
    }
  });
    this.newProfile = '';
    this.$location.path('/');

  };

  }



angular.module('untitled1App')
  .controller('ProfileController', ProfileController);
