angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('frontpageCtrl', function($scope, $state) {
  
  $scope.allimages = [
    'img/home1.jpeg','img/home2.jpeg','img/home3.jpeg'
  ];

  $scope.goto = function(){
    $state.go('login')
  }

})

.controller('LoginCtrl', function($scope, $state, $http , $ionicPlatform, UserSession, $cordovaGeolocation) {
     
    $scope.goto = function(){
      $state.go('signup')
    }

    $scope.data = {};  

    if(UserSession.CheckUser()=="true"){
      //alert("Session exists");
      $state.go('lost1');
    }
 
      var options = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation.getCurrentPosition(options).then(function(position){     
        $scope.lat = position.coords.latitude;
        $scope.lng =  position.coords.longitude;
        console.log("location - " + $scope.lat);
      }, function(error){
        console.log("Could not get location");
      });


    $scope.login = function() {  

      if($scope.data.username == ""){
        alert("Username is required");
        return;
      }

      if( $scope.data.password == ""){
        alert("Password is required");
        return;
      }
      
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
        "username": $scope.data.username, 
        "password": $scope.data.password,
        "lat" : $scope.lat,
        "lng" : $scope.lng
      };
          
      $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
      $http({
        method : 'post',
        url : 'http://10.189.73.224:3000/login',
          data : Object.toparams(myobject)
        }).success(function(data) {
        if(data.code == 404){
          console.log("SQL failed");
          alert("LOGIN FAILED");
        }else
        if(data.code == 200){               
          UserSession.AddUser($scope.data.username);
          console.log("login success");
          $state.go('found');
        }                 
      }).error(function(error){
        alert("LOGIN FAILED");
      });   
    }
})

.controller('HomepageCtrl', function($scope, UserSession, $http) {
  $scope.data = {};
   // alert("print " +  UserSession.GetUser());
    $http.get("http://10.189.73.224:3000/homepage", { params: { "useremail": UserSession.GetUser() } })
     .success(function(response){
          
          $scope.getdetails = JSON.parse(response.results);
          
              }).error(function(error){
                  alert("Something went wrong");
              });  

})

.controller('NewfoundCtrl', function($scope,$http,$state, $cordovaGeolocation, UserSession) {
    
      var options = {timeout: 10000, enableHighAccuracy: false};
      var marker;



      $cordovaGeolocation.getCurrentPosition(options).then(function(position){
     
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
     
        var mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
     
      
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        google.maps.event.addListenerOnce($scope.map, 'idle', function(){
     
      marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
      });    


     
      var infoWindow = new google.maps.InfoWindow({
          content: "Here i found the item"
      });
     
     google.maps.event.addListener($scope.map, 'click', function( event ){
      //alert( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng() ); 
      //position: {lat: -34.397, lng: 150.644}
      marker.setPosition(event.latLng);
      $scope.lat = event.latLng.lat();
      $scope.lng = event.latLng.lng();
    });

      google.maps.event.addListener(marker, 'click', function (event) {
          infoWindow.open($scope.map, marker);      

      });
     
    });
     
      }, function(error){
        console.log("Could not get location");
      })
      //

    $scope.data = {};  
    
    Object.toparams = function ObjecttoParams(obj) 
    {
      var p = [];
      for (var key in obj) 
      {
        p.push(key + '=' + encodeURIComponent(obj[key]));
      }
      return p.join('&');
    };

    $scope.submit = function(){

      var myobject = {
      "userID": UserSession.GetUser() , 
      "itemname": $scope.data.itemName,
      "itemdesc": $scope.data.itemDescr,
      "lostdate": $scope.data.itemMonth+"-"+$scope.data.itemDate+"-"+$scope.data.itemYear,  
      "losttime": $scope.data.itemHour + ":" + $scope.data.itemMinutes,
      "lat" : $scope.lat,
      "lng" : $scope.lng
    };

    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

     $http({
            method : 'post',
            url : 'http://10.189.73.224:3000/addNewFoundItem',
            data : Object.toparams(myobject)
          }).success(function(data) {
            if(data.code == 404){
              console.log("SQL failed");
              alert("Something went wrong.. please try again");
            }else
            if(data.code == 200){               
              alert("Posted successfully");
              $state.go('found');
            }                 
          }).error(function(error){
            alert("Something went wrong.. please try again");
          }); 
        }
  })

.controller('LostCtrl', function($scope, $http, $state ,  $ionicModal, UserSession) {
 
    $scope.hideBackButton=true;
    
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

     Object.toparams = function ObjecttoParams(obj) 
    {
      var p = [];
      for (var key in obj) 
      {
        p.push(key + '=' + encodeURIComponent(obj[key]));
      }
      return p.join('&');
    };

    $scope.logout=function(){
      UserSession.AddUser("");
      $state.go('login');
    }

    $http({
      method : 'post',
      url : 'http://10.189.73.224:3000/lost'
    }).success(function(data) {
      if(data.code == 404){
        console.log("SQL failed");
      }else
      if(data.code == 200){               
        console.log("got found item list");
        $scope.items = data.items;
      }                 
    }).error(function(error){
      alert("Something went wrong.. please try again");
    });
  

     $scope.deletelost =   function(n, user) {
        alert("in delete lost " + n);
      if(user == UserSession.GetUser()){
          var myobject = {
            "id": n 
          };  
        
        $http({
          method : 'post',
          url : 'http://10.189.73.224:3000/deleteLost',
          data : Object.toparams(myobject)
        }).success(function(data) {
          if(data.code == 404){
            alert("sorry couldnt delet the post");
          }else
          if(data.code == 200){               
            alert("Item deleted");
            $state.go(lost1);
          }                 
        }).error(function(error){
          alert("Something went wrong.!!");
        });

      }else{
        alert("you can delete only your posts");
      }
    } ;


     $scope.addItem = function() {
          $state.go('NewlostItem');
      } 
      $scope.lost=function(){
        $state.go('lost1');
      }

      $scope.found = function() {
      //  alert("found page");
          $state.go('found');
      } 
       $scope.add=function(i){
      //  alert("Print" + i);
        UserSession.setitemid(i);
        $state.go('showdetails');
      }

      $scope.gohome = function(){
        $state.go('homepage');
      }    

    $scope.deletefound =   function(n, user) {
      if(user == UserSession.GetUser()){

         var myobject = {
            "id": n 
          };  
        
        $http({
          method : 'post',
          url : 'http://10.189.73.224:3000/deleteFound',
          data : Object.toparams(myobject)
        }).success(function(data) {
          if(data.code == 404){
            alert("sorry couldnt delet the post");
          }else
          if(data.code == 200){               
            alert("Item deleted");
            $state.go(found);
          }                 
        }).error(function(error){
          alert("Something went wrong.!!");
        });

      }else{
        alert("you can delete only your posts");
      }
    } ;   


      $scope.showdetails =   function(n) {
        UserSession.setitemid(n);
        $state.go('add');
        }    
})


.controller('SignUpCtrl', function($scope, $state, $http, $ionicPlatform, UserSession) {

        $scope.data = {};

       $scope.signup = function() {

          console.log("Name is: " + $scope.data.fname + " "+$scope.data.lname);
          console.log("password is: " + $scope.data.password);
          console.log("Email is: " + $scope.data.email);
          console.log("Phone is: " + $scope.data.phone);

            if($scope.data.fname == ""){
              alert("First Name is required");
              return;
            }


            if($scope.data.lname == ""){
              alert("Last Name is required");
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
                
                //Push Notifiction 
                pushNotification = window.plugins.pushNotification;

                window.onNotification = function(e){

                 console.log('notification received'+ e.event + e.regid.length);

                  switch(e.event){
                  
                    case 'registered':
                    
                    if(e.regid.length > 0){
                      var device_token = e.regid;
                      $scope.tokenId = device_token;
                   //   alert($scope.tokenId);

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
                        "fname": $scope.data.fname ,
                        "lname": $scope.data.lname ,
                        "password": $scope.data.password ,
                        "email": $scope.data.email ,
                        "phone": $scope.data.phone,
                        "tokenId" : $scope.tokenId                  
                      };  
                      
                      $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                      $http({
                        method : 'post',
                        url : 'http://10.189.73.224:3000/signup',
                          data : Object.toparams(myobject)
                        }).success(function(response)
                        {
                          console.log(response);
                          if(response.code == 200 ){
                            UserSession.AddUser(response.user_ID);
                        //    alert(UserSession.GetUser());
                            $state.go('lost1');
                          }
                          else{
                            $state.go('signup');                      
                          }
                        })
                        .error(function(error)
                        {
                          alert("SignUp FAILED");
                        });                      
                    }
                    break;

                    case 'message':
                //      alert('msg received');
                //      alert(JSON.stringify(e));
                    break;

                    case 'error':
                    alert('error occured');
                    break;
                  }
                };

                window.errorHandler = function(error){
                  alert('an error occured');
                }

                pushNotification.register(
                  onNotification,
                  errorHandler,
                  {
                    'badge': 'true',
                    'sound': 'true',
                    'alert': 'true',
                    'senderID': '877218038465',
                    'ecb': 'onNotification'
                  }
                );
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



.controller('showdetailsCtrl', function($scope,$http, UserSession) {
      /* $http.get("http://localhost:3000/showdetails", { params: { "id": UserSession.getitemid() } })
         .success(function(response){
              $scope.results= JSON.parse(response.details)
              alert(response);
                  }).error(function(error){
                      alert("ERROR SHOW DETAILS");
                  });*/

$scope.data = {};  
    
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
        "id": UserSession.getitemid() 
      };

    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

     $http({
            method : 'post',
            url : 'http://10.189.73.224:3000/showdetails',
            data : Object.toparams(myobject)
          }).success(function(response){
              $scope.results= JSON.parse(response.details)
            //  alert(response);
          }).error(function(error){
         //     alert("ERROR SHOW DETAILS");
          });
})

.controller('showfounddetailsCtrl', function($scope,$http, UserSession) {
      /* $http.get("http://localhost:3000/showdetails", { params: { "id": UserSession.getitemid() } })
         .success(function(response){
              $scope.results= JSON.parse(response.details)
              alert(response);
                  }).error(function(error){
                      alert("ERROR SHOW DETAILS");
                  });*/

$scope.data = {};  
    
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
        "id": UserSession.getitemid() 
      };

    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

     $http({
            method : 'post',
            url : 'http://10.189.73.224:3000/showfounddetails',
            data : Object.toparams(myobject)
          }).success(function(response){
              $scope.results= JSON.parse(response.details)
         //     alert(response);
          }).error(function(error){
        //      alert("ERROR SHOW DETAILS");
          });
})

.controller('NewlostItemCtrl', function($scope,$state,$http,$ionicLoading, $state, $cordovaGeolocation, UserSession) {
  //
    var options = {timeout: 10000, enableHighAccuracy: false};
    var marker;



    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
   
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
   
      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
   
    
      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      google.maps.event.addListenerOnce($scope.map, 'idle', function(){
   
    marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng
    });    


   
    var infoWindow = new google.maps.InfoWindow({
        content: "Here i found the item"
    });
   
   google.maps.event.addListener($scope.map, 'click', function( event ){
    //alert( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng() ); 
    //position: {lat: -34.397, lng: 150.644}
    marker.setPosition(event.latLng);
    $scope.lat = event.latLng.lat();
    $scope.lng = event.latLng.lng();
  });

    google.maps.event.addListener(marker, 'click', function (event) {
        infoWindow.open($scope.map, marker);      

    });
   
  });
   
    }, function(error){
      console.log("Could not get location");
    })
  //
  $scope.data = {};
 
  $scope.submit = function(){

      var myobject = {
      "userID": UserSession.GetUser() , 
      "itemname": $scope.data.itemName,
      "itemdesc": $scope.data.itemDescr,
      "lostdate": $scope.data.itemMonth+"-"+$scope.data.itemDate+"-"+$scope.data.itemYear,  
      "losttime": $scope.data.itemHour + ":" + $scope.data.itemMinutes,
      "lat" : $scope.lat,
      "lng" : $scope.lng
    };

    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

     $http({
            method : 'post',
            url : 'http://10.189.73.224:3000/NewlostItem',
            data : Object.toparams(myobject)
          }).success(function(data) {
            if(data.code == 404){
              console.log("SQL failed");
              alert("Something went wrong.. please try again");
            }else
            if(data.code == 200){               
              alert("Posted successfully");
              $state.go('lost1');
            }                 
          }).error(function(error){
            alert("Something went wrong.. please try again");
          }); 
        }   
})


.controller('foundCtrl', function($scope,$http,$state, UserSession) {
  
    $scope.data = {};  
  // $scope.hideBackButton=true;
  

  $scope.lost=function(){
    $state.go('lost1');
  }

  $scope.logout=function(){
    UserSession.AddUser("");
    $state.go('login');
  }
  $scope.addItem = function() {
    $state.go('NewFoundItem');
  } 


   $scope.showfounddetails=function(i){
        UserSession.setitemid(i);
        $state.go('showfounddetails');
      }
  // $scope.add=function(item){
  //  var item1=item;
  //   $state.go('add',{item1});
  // }

   $scope.gohome = function(){
        $state.go('homepage');
      } ; 

  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  $http({
    method : 'post',
    url : 'http://10.189.73.224:3000/getFoundItems'
  }).success(function(data) {
    if(data.code == 404){
      console.log("SQL failed");
    }else
    if(data.code == 200){               
      console.log("got found item list");
      $scope.items = data.items;
    }                 
  }).error(function(error){
    alert("LOGIN FAILED");
  });

})



.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
