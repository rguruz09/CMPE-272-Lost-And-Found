angular.module('starter.services', [])

//factory for session
.factory('UserSession', function(){

  var user_email ="";
  var user_name = "" ; 
  var getitemid = "";


  return {
     getitemid: function() {
      return getitemid;
    },
     setitemid: function(id) {
      getitemid = id;
    },
     GetUserName: function() {
      return user_name;
    },
     AddUserName: function(uname) {
      user_name = uname;
    },
    GetUser: function() {
      return user_email;
    },

    AddUser: function(email) {
      user_email = email;
    },
    CheckUser: function() {
      if(user_email==""){
        return "false";
      }
      return "true";
    }
  };

})

.service('RequestService', ['$http', '$q', '$ionicLoading',  RequestService]);
 //.service('RequestsService', function($http, $q, $ionicLoading){
    function RequestService($http, $q, $ionicLoading){

        console.log('inside RequestsService');
        var base_url = 'http://10.189.73.224:3000';

        function register(device_token){
            console.log('inside register' + device_token);
            var deferred = $q.defer();
            $ionicLoading.show();


            // Object.toparams = function ObjecttoParams(obj) 
            // {
            //   var p = [];
            //   for (var key in obj) 
            //   {
            //     p.push(key + '=' + encodeURIComponent(obj[key]));
            //   }
            //   return p.join('&');
            // };

            // var myobject = {
            //   "device_token": device_token 
            // };

            //alert(device_token);

               $http.get(base_url + '/registerDevice', { params: { 'device_token': device_token } })
                .success(function(response){

                    $ionicLoading.hide();
                    deferred.resolve(response);

                })
                .error(function(data){
                    deferred.reject();
                });

            // $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            // $http({
            //   method : 'post',
            //   url : 'http://192.168.1.100:3000/registerDevice',
            //   data : Object.toparams(myobject)
            // }).success(function(response){
              
            //         $ionicLoading.hide();
            //         deferred.resolve(response);

            // }).error(function(error){
            //   alert("ERROR SHOW DETAILS");
            //   deferred.reject();
            // });
            return deferred.promise;
        };

        return {
            register: register
        };
 //   })
};


// .service('RequestsService', ['$http', '$q', '$ionicLoading',  RequestsService]);
//  //.service('RequestsService', function($http, $q, $ionicLoading){
//     function RequestsService($http, $q, $ionicLoading){
//         console.log('inside RequestsService');
//         var base_url = 'http://localhost:3000';

//         function register(device_token){
//             console.log('inside register' + device_token);
//             var deferred = $q.defer();
//             $ionicLoading.show();

//             $http.get(base_url + '/register', { params: { 'device_token': device_token } })
//           //  $http.get(base_url + '/register', {'device_token': device_token})
//                 .success(function(response){

//                     $ionicLoading.hide();
//                     deferred.resolve(response);

//                 })
//                 .error(function(data){
//                     deferred.reject();
//                 });

//             return deferred.promise;

//         };


//         return {
//             register: register
//         };
//  //   })
// }
// ;