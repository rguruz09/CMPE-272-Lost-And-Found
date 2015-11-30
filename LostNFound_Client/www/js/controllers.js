angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('NewlostItemCtrl', function($scope,$state,$http,$ionicLoading) {

/*
google.maps.event.addDomListener(window, 'load', function() {
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
 
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });
 
        $scope.map = map;
    });

*/
$scope.data = {};
 $scope.submit = function() {

 //$http.get("http://localhost:3000/NewlostItem", { params: { "itemname": $scope.data.itemName , "itemdesc": $scope.data.itemDescr , "lostdate":$scope.data.itemDate ,"losttime":$scope.data.itemTime  } })
 $http.get("http://localhost:3000/NewlostItem", { params: { "itemname": $scope.data.itemName , "itemdesc": $scope.data.itemDescr , "lostdate":'2015-09-12' ,"losttime": '09:10' } })
         .success(function(response){
                   if(response.login == "Success")
                      $state.go('lost1');
              }).error(function(error){
                  alert("ERROR ADDING NEW ITEM");
              });  
    }    
})


.controller('SignUpCtrl', function($scope, $state, $http) {

        $scope.data = {};

       $scope.signup = function() {

          console.log("Name is: " + $scope.data.name);
          console.log("password is: " + $scope.data.password);
          console.log("Email is: " + $scope.data.email);
          console.log("Phone is: " + $scope.data.phone);

            if($scope.data.name == ""){
              alert("Username is required");
              return;
            }

            if( $scope.data.password == ""){
              alert("Password is required");
              return;
            }

            if($scope.data.phone == ""){
              alert("Phone number is required");
              return;
            }

            if( $scope.data.email == ""){
              alert("Email is required");
              return;
            }

          if(/^[A-Za-z]+$/.test($scope.data.name))
          {
            if(/^[A-Za-z0-9._]+@[A-Za-z0-9]+\.com$/.test($scope.data.email))
            {
              if(/^[0-9]{10}$/.test($scope.data.phone))
              {
                console.log("Input validated");
                // Add to DB
                $http.get("http://localhost:3000/signup", 
                {
                  params:
                  { 
                    "name": $scope.data.name ,
                    "password": $scope.data.password ,
                    "email": $scope.data.email ,
                    "phone": $scope.data.phone
                  }
                })
                  .success(function(response)
                  {
                    if(response.signup == "Success")
                      $state.go('login');
                    else
                      window.location = '/index';
                    })
                  .error(function(error)
                  {
                    alert("LOGIN FAILED");
                  });  
              } 
              else 
              {
                alert("Invalid Phone number. Must have 10 digits.")
              }
            }
            else
            {
              alert("Invalid email. Must be of the form abc@test.com.") 
            }
          }
          else
          {
            alert("Invalid name. Can contain alphanumerics or '.' or '_' ")
          }
    }   
})


.controller('LostCtrl', function($scope, $http, $state , UserSession) {

  alert("insidecontroller");
 
    $http.post("http://localhost:3000/lost")
         .success(function(response){
                   $scope.items= JSON.parse(response.items)
              }).error(function(error){
                  alert("LOGIN FAILED");
              });  
  

     $scope.addItem = function() {
          $state.go('NewlostItem');
      } 

      $scope.found = function() {
        alert("found page");
          $state.go('found');
      } 


      $scope.updateuserInfo = function(){
        $state.go('homepage');
      }    

     $scope.ondelete =   function(n) {

     $http.get("http://localhost:3000/ondelete", { params: { "uid": n } })
     .success(function(response){
                       if(response.login == "Success")
                          $state.go('lost1');
                  }).error(function(error){
                      alert("ERROR ADDING NEW ITEM");
                  }); 
        }    


      $scope.showdetails =   function(n) {
        UserSession.setitemid(n);
        $state.go('add');
        }    
})

.controller('addCtrl', function($scope,$http, UserSession) {
       $http.get("http://localhost:3000/showdetails", { params: { "id": UserSession.getitemid() } })
         .success(function(response){
              $scope.results= JSON.parse(response.details)
              alert(response);
                  }).error(function(error){
                      alert("ERROR SHOW DETAILS");
                  });
})


.controller('ChatsCtrl', function($scope, Chats) {
  // With the 

//   if(UserSession.GetUser()=="neha"){
//       $state.go('login');
//     }
//   else
//   {
//       alert("show me username" + UserSession.GetUser());
//      $state.go('lost1');
//   }


// new view caching in Ionic, Controllers are only called
//   // when they are recreated or on app start, instead of every page change.
//   // To listen for when this page is active (for example, to refresh data),
//   // listen for the $ionicView.enter event:
//   //
//   //$scope.$on('$ionicView.enter', function(e) {
//   //});

//   $scope.chats = Chats.all();
//   $scope.remove = function(chat) {
//     Chats.remove(chat);
//   };
})


.controller('LoginCtrl', function($scope, $state, $http , UserSession) {
  
      $scope.data = {};  

    if(UserSession.CheckUser()=="true"){
      alert("Session exists");
      $state.go('lost1');
    }
 
        $scope.login = function() {
         
           if($scope.data.username == ""){
            alert("Username is required");
            return;
          }

          if( $scope.data.password == ""){
          alert("Password is required");
            return;
          }
             $http.get("http://localhost:3000/login", { params: { "username": 'neha@gmail.com' , "password": '12345' } })
     //   $http.get("http://localhost:3000/login", { params: { "username": $scope.data.username , "password": $scope.data.password } })
         .success(function(response){
          alert(response);
                    if(response.login == "Success"){
                      $state.go('lost1');
                      UserSession.AddUser($scope.data.username);
                      alert(UserSession.GetUser());


                    }
                   
              }).error(function(error){
                  alert("LOGIN FAILED");
              });  
    }

})
  

    /*$scope.data = {};
    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).success(
          function(data) {
            $state.go('lost');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    } */


.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


.controller('HomepageCtrl', function($scope, UserSession, $http) {
  $scope.data = {};
    alert("print " +  UserSession.GetUser());
    $http.get("http://localhost:3000/homepage", { params: { "useremail": UserSession.GetUser() } })
     .success(function(response){
          
          $scope.getdetails = JSON.parse(response.results);
          
              }).error(function(error){
                  alert("LOGIN FAILED");
              });  
 /* $scope.data = {};
  $scope.update = function() {
          console.log("Email is: " + $scope.data.email);
          console.log("Phone is: " + $scope.data.phone);

            if($scope.data.email == ""){
              alert("email is required");
              return;
            }

            if( $scope.data.phone == ""){
              alert("Phone is required");
              return;
            }

            if(/^[A-Za-z0-9._]+@[A-Za-z0-9]+\.com$/.test($scope.data.email))
            {
              if(/^[0-9]{10}$/.test($scope.data.phone))
              {
                console.log("Input validated");
                // Add to DB
                $http.get("http://localhost:3000/homepage", 
                {
                  params:
                  {
                    "email": $scope.data.email ,
                    "phone": $scope.data.phone
                  }
                })
                  .success(function(response)
                  {
                    if(response.signup == "Success")
                      $state.go('login');
                    else
                      window.location = '/index';
                    })
                  .error(function(error)
                  {
                    alert("LOGIN FAILED");
                  });  
              } 
              else 
              {
                alert("Invalid Phone number. Must have 10 digits.")
              }
            }
            else
            {
              alert("Invalid email. Must be of the form abc@test.com.") 
            }
        }*/
});
