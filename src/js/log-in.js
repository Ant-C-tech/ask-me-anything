"use strict";

import { createContent } from "./utils.js";
import { isValidEmail } from "./utils.js";
import { isValidPassword } from "./utils.js";
import { userWindowContent } from "./user-window.js";
import { activateUserWindowContent } from "./user-window.js";
import { Question } from "./question.js";
import { API_KEY } from "./register.js";

import { TOGGLE_SCREEN_BUTTON } from "./register.js";
import { LOGIN_BUTTON } from "./register.js";
import { LOGOUT_BUTTON } from "./register.js";
import { REGISTER_BUTTON } from "./register.js";
import { showUserNameGreeting } from "./register.js";
import { USER_NAME_BLOCK } from "./register.js";

export let authToken;
export let authUid;

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
      minlength="6"
      required
    />
    <label for="passwordInput">Your Password (at least 6 symbols)...</label>
  </div>
  <button
    id="logInBtn"
    type="submit"
    class="mui-btn mui-btn--primary"
  >
    Login
  </button>
</form>`;

const authWithEmailAndPassword = (email, password) => {
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

const logInFormHandler = (e) => {
  e.preventDefault();

  const userEmail = document.querySelector("#emailInput").value;
  const userPassword = document.querySelector("#passwordInput").value;

  if (isValidEmail(userEmail) && isValidPassword(userPassword)) {
    LOGIN_BUTTON.classList.add("d-none");
    REGISTER_BUTTON.classList.add("d-none");
    LOGOUT_BUTTON.classList.remove("d-none");
    TOGGLE_SCREEN_BUTTON.classList.remove("d-none");
    TOGGLE_SCREEN_BUTTON.innerHTML = "All";

    authWithEmailAndPassword(userEmail, userPassword)
      .then((data) => {
        authUid = data.localId;
        authToken = data.idToken;
        showUserNameGreeting(data.email);
        createContent(userWindowContent, activateUserWindowContent);
        mui.overlay("off");
      })
      .catch(() => {
        mui.overlay("off");
        createContent(
          '<div class="mui--text-headline">Password or email is wrong or You did not register yet. Try again or register!</div>'
        );
        REGISTER_BUTTON.classList.remove("d-none");
        LOGIN_BUTTON.classList.remove("d-none");
        LOGOUT_BUTTON.classList.add("d-none");
        TOGGLE_SCREEN_BUTTON.classList.add("d-none");
      });
  }
};

export const activateLogInForm = () => {
  const logInButton = document.querySelector("#logInBtn");
  logInButton.addEventListener("click", logInFormHandler, { once: true });
};

export const logOut = () => {
  authToken = '';
  authUid = '';
  USER_NAME_BLOCK.innerHTML = "";
  Question.getAllQuestions();
  REGISTER_BUTTON.classList.remove("d-none");
  LOGIN_BUTTON.classList.remove("d-none");
  LOGOUT_BUTTON.classList.add("d-none");
  TOGGLE_SCREEN_BUTTON.classList.add("d-none");
};
