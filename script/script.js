import firebase from './firebase.js';
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const database = getDatabase(firebase);
const dbRef = ref(database);

const loginFormElement = document.querySelector('#loginForm');
const signupFormElement = document.querySelector('#signUpForm');

let frontEndData = {};
let currentUser= {}

const constructUser = (username, password) => {
  return {
    "username": username,
    "password": password,
  }
}

loginFormElement.addEventListener('submit', e => {
   
  e.preventDefault()
    const givenUsername = e.target[0].value
    const givenPassword = e.target[1].value

    //for loop going through users checking to see if username and password match a specific user
  
    Object.values(frontEndData.users).forEach((user) => {
      if(user.username === givenUsername && user.password === givenPassword) {
        currentUser = user
      }
    })
})

signupFormElement.addEventListener('submit', e => {
  e.preventDefault()
  const givenUsername = e.target[0].value
  const givenPassword = e.target[1].value
  let isTakenUsername = false; 
  const userObject = ref(database, 'users');

  // check to see if username already exists

  for(let user in frontEndData.users) {
    let checkUser = frontEndData.users[user].username
    if(givenUsername === checkUser) {
      isTakenUsername = true;
      break;
    }
  }
  //Checking to see if username is already taken, if not will create new user and push to database
  if (isTakenUsername === false) {
    push(userObject, constructUser(givenUsername, givenPassword));
    currentUser = constructUser(givenUsername, givenPassword);
  }
})

onValue(dbRef, (data) => {
    if(data.exists()){
      frontEndData = data.val()
    }
  })

