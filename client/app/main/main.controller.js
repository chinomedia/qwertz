(function(){
'use strict';


function MainController ($http, $scope, Auth, lodash, $window) {

  var vm = this;
  vm.$http = $http;
  vm.calc=1;
  var _ = lodash;
  vm.select = [];
  vm.size = 0;
  vm.markers= [];
  vm.deformation =false;
  vm.admin=Auth.isAdmin();

  vm.isAdmin =function() {
    console.log(Auth.isAdmin());
   return Auth.isAdmin();
  }
  vm.selected = function (index) {
    console.log("selected " + index);
    var indexOf = vm.select.indexOf(index);
    vm.service = new google.maps.DistanceMatrixService();

    google.maps.Map.prototype.clearMarkers = function() {
      for(var i=0; i < vm.markers.length; i++){
        vm.markers[i].setMap(null);
      }
      vm.markers = new Array();
    };
    if ((indexOf == -1) && (vm.select.length <=3)) {
      vm.select.push(index);
    }
    else if(indexOf != -1){
      vm.select.splice(indexOf, 1);
    }

  };
  vm.isSelected = function (index) {
    return (vm.select.indexOf(index) != -1);
  }
  vm.calculate = function (){
    google.maps.Map.prototype.clearMarkers();
    vm.calc =0;
    var req = {
      method: 'GET',
      url: '/api/profiles/postal/'+vm.postal

    };
    vm.$http(req).then(function(res){

        vm.profiles = res.data.profiles;



        vm.$http.post('/api/calc',vm.calculations).then((res) => {
          vm.result = res.data.calc;
          console.log(vm.result)
          vm.calc =2;
          if(!vm.map) {
            vm.map = new google.maps.Map(document.getElementById('googleMap'), {
              center: {lat:51.401497,lng: 10.472748},
              zoom: 6,
              scrollwheel: true,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            console.log("map:");
            console.log(vm.map);
          }else{
            console.log("map:");
            console.log(vm.map);
            vm.map.setCenter({lat:51.401497,lng: 10.472748});
            vm.map.setZoom(6);
          }
          for (var i = 0; i < vm.markers.length; i++) {
            vm.markers[i].setMap(null);
          }
          vm.markers = [];
          console.log(vm.profiles);
          vm.profiles.forEach(function(profile){


            console.log(profile.distance.text);

            vm.markers.push(new google.maps.Marker({
              map: vm.map,
              position: profile.location,
              title: profile.name
            }));



            console.log(vm.profiles);


          });


          vm.bounds = new google.maps.LatLngBounds();
          for (var i = 0; i < vm.markers.length; i++) {
            vm.bounds.extend(vm.markers[i].getPosition());
          }

          if(vm.markers.length != 0) {
            vm.map.setCenter({lat : vm.profiles[0].location.lat, lng : vm.profiles[0].location.lng});
            vm.map.setZoom(10);
            //vm.map.fitBounds(vm.bounds);
            console.log('setbounds');
          }
        });
      },
      function(err){
        throw err;
      });
    $window.scrollTo(0, 0);
    vm.calculations={
      'selected':vm.select,'deformation':vm.deformation,'carSize':vm.size
    };



  };

}






  angular.module('untitled1App')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController,
      controllerAs: 'main'
    });

})();
