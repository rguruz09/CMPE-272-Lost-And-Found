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

});