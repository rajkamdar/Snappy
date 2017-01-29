
ifUserIsLoggedIn(function(){
 //Update user data
 updateUserData();

 loadUsers(function(users){

   var usersList="";

   for(var uid in users){
     var user=users[uid];

     if(uid==window.currentUser.id)
     {
       continue;
     }
     else {
       usersList+=renderUser(user);
     }
   }

   getElement("members").innerHTML=usersList;
 });
});
