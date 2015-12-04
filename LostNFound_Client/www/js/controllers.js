angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('frontpageCtrl', function($scope) {
$scope.allimages = [
         '../img/home1.jpeg','../img/home2.jpeg','../img/home3.jpeg'
    ];
})


.controller('overlayController',function($scope, $timeout){
 
        var startimg="img/image.jpg";
        $scope.image=startimg;
        $scope.textOverlay="";
 
        var canvas = document.getElementById('tempCanvas');
        var context = canvas.getContext('2d');
 
        $scope.createOverlay= function(){
 
          var source =  new Image();
          source.src = startimg;
          canvas.width = source.width;
          canvas.height = source.height;
 
          console.log(canvas);
 
          context.drawImage(source,0,0);
 
          context.font = "100px impact";
          textWidth = context.measureText($scope.frase).width;
 
          if (textWidth > canvas.offsetWidth) {
              context.font = "20px impact";
          }
          context.textAlign = 'center';
          context.fillStyle = 'black';
 
          context.fillText($scope.textOverlay,canvas.width/2,canvas.height*0.8);
 
            var imgURI = canvas.toDataURL();
 
          $timeout( function(){
              $scope.image = imgURI;
          }, 200);
        }
 
})



.controller('NewlostItemCtrl', function($scope,$state,$http,$ionicLoading, UserSession) {

  $scope.$on('$ionicView.enter', function() {
     // Code you want executed every time view is opened
     console.log('Opened!')

   
            map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -33.8688, lng: 151.2195},
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
           });

  })

  $scope.data = {};
 
  $scope.submit = function() {

  //$http.get("http://localhost:3000/NewlostItem", { params: { "itemname": $scope.data.itemName , "itemdesc": $scope.data.itemDescr , "lostdate":$scope.data.itemDate ,"losttime":$scope.data.itemTime  } })
  $http.get("http://localhost:3000/NewlostItem", { params: { "userID": UserSession.GetUser() , "itemname": $scope.data.itemName , "itemdesc": $scope.data.itemDescr , "lostdate":'2015-09-12' ,"losttime": '09:10' } })
         .success(function(response){
                   if(response.login == "Success")
                      $state.go('lost1');
              }).error(function(error){
                  alert("ERROR ADDING NEW ITEM");
              });  
    }    
})


.controller('addNewFoundItem', function($scope,$state,$http,$ionicLoading, UserSession) {

  $scope.data = {};
  $scope.addIten = function() {


  
  $http({
            method : 'post',
            url : 'http://localhost:3000/addNewFoundItem',
            data : {
                "userID": UserSession.GetUser() , 
                "itemname": $scope.itemName , 
                "itemdesc": $scope.itemDescr , 
                "lostdate":'2015-09-12',
                "losttime": '09:10'       
              }
          }).success(function(data) {
            if(data.code == 404){
              console.log("SQL failed");
              $state.go('found');
            }else
            if(data.code == 200){               
              console.log("Added to found item list");
              $state.go('found');
            }                 
          }); 
    }    
})

.controller('SignUpCtrl', function($scope, $state, $http, UserSession) {

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
                // Add to DB
                $http.get("http://localhost:3000/signup", 
                {
                  params:
                  { 
                    "fname": $scope.data.fname ,
                    "lname": $scope.data.lname ,
                    "password": $scope.data.password ,
                    "email": $scope.data.email ,
                    "phone": $scope.data.phone
                  }
                })
                  .success(function(response)
                  {
                    console.log(response);
                    if(response.code == 200 ){
                      UserSession.AddUser(response.user_ID);
                      alert(UserSession.GetUser());
                      $state.go('lost1');
                    }
                    else{
                      $state.go('signup');                      
                    }
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


.controller('LostCtrl', function($scope, $http, $state ,  $ionicModal, UserSession) {
 
    $scope.hideBackButton=true;
    $http.post("http://localhost:3000/lost")
         .success(function(response){
                   if(response.code == 200){
                      $scope.items = response.items;  
                   }else
                   {
                      console.log("No items");
                   }
              }).error(function(error){
                  alert("LOGIN FAILED");
              });  
  

     $scope.addItem = function() {
          $state.go('NewlostItem');
      } 
      $scope.lost=function(){
        $state.go('lost1');
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
                      alert("ERROR DELETING NEW ITEM");
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

.controller('foundCtrl', function($scope,$http,$state) {
  $scope.hideBackButton=true;
//$scope.item1u="";
//$scope.item1i="";
$scope.lost=function(){
    $state.go('lost1');
  }
  $scope.found=function(){
    $state.go('Found');
  }
  $scope.addItem = function() {
    $state.go('NewlostItem');
  } 
  $scope.add=function(item){
    console.log("bye",item);
   var item1=item;
     console.log("hii",item1);
  //item1u=item.firstname;
//item1i=item.itemname;
    $state.go('add',{item1});
  }


  $http({
            method : 'post',
            url : 'http://localhost:3000/getFoundItems'
          }).success(function(data) {
            if(data.code == 404){
              console.log("SQL failed");
            }else
            if(data.code == 200){               
              console.log("got found item list");
              $scope.items = data.items;
            }                 
          });

})



.controller('Lost1Ctrl', function($scope,$http,$state) {
  $scope.hideBackButton=true;
//$scope.item1u="";
//$scope.item1i="";
$scope.lost=function(){
    $state.go('lost1');
  }
  $scope.found=function(){
    $state.go('Found');
  }

  $scope.add=function(item){
    console.log("bye",item);
   var item1=item;
     console.log("hii",item1);
  //item1u=item.firstname;
//item1i=item.itemname;
    $state.go('add',{item1});
  }

$http({
                  method: 'POST',
                  url:'http://localhost:8100/ionic-lab',
                  }).success(function(response){
                    
                    $scope.items=[
{
  "itemname" : "Watch",
"firstname" : "Neha",
"lastname" : "Sah",
"userpic" : "blank.png",
"time" : "60 minutes",
"address" : " 211 S 9th St, San Jose, CA 95112",
"itemdesc" : "Black Tommy Hilfiger watch"
},
{
  "itemname" : "Goggles",
"firstname" : "Shru",
"lastname" : "K",
"userpic" : "blank.png",
"time" : "10 minutes",
"address" : "150 E San Fernando St, San Jose, CA 95112",
"itemdesc" : "Blue Ray Ban Googles"
},
{
  "itemname" : "Charger",
"firstname" : "Raghu",
"lastname" : "G",
"userpic" : "blank.png",
"time" : "3 hours",
"address" : "Dudley Moorhead Hall, San Jose, CA 95112",
"itemdesc" : "Dell Charger"
}
];
})
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
             $http.get("http://localhost:3000/login", { params: { "username": $scope.data.username , "password": $scope.data.password } })
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
