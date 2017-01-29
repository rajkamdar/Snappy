function redirect(path){
  window.location=path;
  return false;
}


function click(elementId,fn)
{
  var element=document.getElementById(elementId);
  if(element)
  {
    element.addEventListener("click",fn);
  }
}

function loginWithGoogle()
{
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function(result) {

  // The signed-in user info.
  var user = result.user;

  //Create User
  createUser(user.uid,user.displayName,user.email);
}).catch(function(error) {
    console.log(error.message);
});
}

function logInUser()
{
  loginWithGoogle();

}

function createUser(uid,uname,uemail)
{

  // Get a reference to the database service
  var database = firebase.database();

  var usersRef=database.ref("users");

  var user = {
    name: uname,
    email: uemail,
    id: uid
  };

  usersRef.child(uid).set(user).then(function(){
    redirect("chat.html");
  });
}

function ifUserIsLoggedIn(fn){

  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in
    window.currentUser = {
      id:user.uid,
      name:user.displayName,
      email:user.email
    };

    fn();
  } else {
    // No user is signed in.
  }
});

}

function getElement(id)
{
  return document.getElementById(id);
}

function updateUserData()
{
  var usernameElement=getElement("user-name");

  usernameElement.textContent = window.currentUser.name;
}

function loadUsers(fn)
{
  var database=firebase.database();
  var usersRef=database.ref("users");

  usersRef.on('value',function(snapshot){
    var users=snapshot.val();

    fn(users);
  });
}
function renderUser(user){
  var uid = user.id;
  var chat_id=getChatId(window.currentUser.id,uid);
  var name = user.name;
  var html= '<div id="'+ chat_id +'"class="member">'+ name +'</div>';

  return html;
}



function getChatId(id1,id2)
{
  if(id1>id2)
    return(id1+""+id2);
  return (id2+""+id1);
}


function onClickMultiple(className, func) {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains(className)) {
            func(event.target);
        }
    });
}


function loadMessages(chat_id,fn)
{
  var database=firebase.database();
  var chatsRef=database.ref("chats");

  chatsRef.child(chat_id).on('value',function(snapshot){
    var messages=snapshot.val();

    fn(messages);
  });
}

function renderMessage(message){
  var text=message.text;
  var msgClass="";
  if(message.sender_id==window.currentUser.id){
    msgClass="by-user";
  }
  var html='<div class="message">'+text+'</div>';

  return html;
}
