

(function(){

    angular.module('starter',[])
    .service('RequestsService', ['$http', '$q', '$ionicLoading',  RequestsService]);

    function RequestsService($http, $q, $ionicLoading){

        var base_url = 'http://{YOUR SERVER}';

        function register(device_token){

            var deferred = $q.defer();
            $ionicLoading.show();

             Object.toparams = function ObjecttoParams(obj) 
            {
              var p = [];
              for (var key in obj) 
              {
                p.push(key + '=' + encodeURIComponent(obj[key]));
              }
              return p.join('&');
            };

            var myobject = {
              "device_token": device_token 
            };


            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            $http({
              method : 'post',
              url : 'http://192.168.1.100:3000/registerDevice',
              data : Object.toparams(myobject)
            }).success(function(response){
              alert(response);
            }).error(function(error){
              alert("ERROR SHOW DETAILS");
            });


            return deferred.promise;

        };


        return {
            register: register
        };
    }
})();