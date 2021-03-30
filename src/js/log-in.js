"use strict";

import { createContent } from "./utils.js";
import { userWindowContent } from "./user-window.js";
import { activateUserWindowContent } from "./user-window.js";
import { Question } from "./question.js";
import { API_KEY } from "./register.js";
import { USER_NAME_BLOCK } from "./register.js";
import { TOGGLE_SCREEN_BUTTON } from "./register.js";
import { LOGIN_BUTTON } from "./register.js";
import { LOGOUT_BUTTON } from "./register.js";
import { REGISTER_BUTTON } from "./register.js";


export let authToken;
export let userName;

export const logInContent = `<h3 class="mui--text-headline">Login to your account</h3>
<form id="logInForm" class="mui-form">
  <div class="mui-textfield mui-textfield--float-label">
    <input
      id="emailInput"
      type="email"
      required
    />
    <label for="emailInput">Your Email...</label>
  </div>
  <div class="mui-textfield mui-textfield--float-label">
    <input
      id="passwordInput"
      type="password"
      required
    />
    <label for="passwordInput">Your Password...</label>
  </div>
  <button
    id="logInBtn"
    type="submit"
    class="mui-btn mui-btn--primary"
    disabled
  >
    Login
  </button>
</form>`;

export const authWithEmailAndPassword = (email, password) => {
  return fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((response) => response.json());
};

const showUserNameGreeting = (email) => {
  userName = email.slice(0, email.indexOf("@"));
  USER_NAME_BLOCK.innerHTML = `Welcome, <span class="bold">${userName}</span>!<br>Don't hesitate to ask!`;
};

const logInFormHandler = (e) => {
  e.preventDefault();
  LOGIN_BUTTON.classList.add("d-none");
  REGISTER_BUTTON.classList.add("d-none");
  LOGOUT_BUTTON.classList.remove("d-none");
  TOGGLE_SCREEN_BUTTON.classList.remove("d-none");
  TOGGLE_SCREEN_BUTTON.innerHTML = "All";

  const userEmail = document.querySelector("#emailInput").value;
  const userPassword = document.querySelector("#passwordInput").value;

  authWithEmailAndPassword(userEmail, userPassword).then((data) => {
    authToken = data.idToken;
    showUserNameGreeting(data.email);
  });

  createContent(userWindowContent, activateUserWindowContent);
  mui.overlay("off");
};

export const activateLogInForm = () => {
  const logInButton = document.querySelector("#logInBtn");
  logInButton.addEventListener("click", logInFormHandler, { once: true });
};

export const logOut = () => {
  USER_NAME_BLOCK.innerHTML = "";
  Question.getAllQuestions();
   REGISTER_BUTTON.classList.remove("d-none");
  LOGIN_BUTTON.classList.remove("d-none");
  LOGOUT_BUTTON.classList.add("d-none");
  TOGGLE_SCREEN_BUTTON.classList.add("d-none");
  //Maybe will need 'undefined' for authToken
};
