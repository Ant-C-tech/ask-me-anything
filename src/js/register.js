"use strict";

import { isValidEmail } from "./utils.js";
import { isValidPassword } from "./utils.js";
import { createContent } from "./utils.js";
import { userWindowContent } from "./user-window.js";
import { activateUserWindowContent } from "./user-window.js";

export const API_KEY = "AIzaSyBumV9Ic_eoFB0Wx5CDXPh4YveIo2X4aF0";

export const REGISTER_BUTTON = document.querySelector("#register");
export const USER_NAME_BLOCK = document.querySelector("#userName");
export const TOGGLE_SCREEN_BUTTON = document.querySelector("#toggleScreen");
export const LOGIN_BUTTON = document.querySelector("#logIn");
export const LOGOUT_BUTTON = document.querySelector("#logOut");

export let userName;
export let registerToken;

export const registerContent = `<h3 class="mui--text-headline">Create new account</h3>
<form id="registerForm" class="mui-form">
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
    id="registerBtn"
    type="submit"
    class="mui-btn mui-btn--primary"
  >
    Create
  </button>
</form>`;

export const showUserNameGreeting = (email) => {
  userName = email.slice(0, email.indexOf("@"));
  USER_NAME_BLOCK.innerHTML = `Welcome, <span class="bold">${userName}</span>!<br>Don't hesitate to ask!`;
};

const registerWithEmailAndPassword = (email, password) => {
  return fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
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

const registerFormHandler = (e) => {
  e.preventDefault();

  const userEmail = document.querySelector("#emailInput").value;
  const userPassword = document.querySelector("#passwordInput").value;

  if (isValidEmail(userEmail) && isValidPassword(userPassword)) {
    LOGIN_BUTTON.classList.add("d-none");
    REGISTER_BUTTON.classList.add("d-none");
    LOGOUT_BUTTON.classList.remove("d-none");
    TOGGLE_SCREEN_BUTTON.classList.remove("d-none");
    TOGGLE_SCREEN_BUTTON.innerHTML = "All";

    registerWithEmailAndPassword(userEmail, userPassword)
      .then((data) => {
        registerToken = data.idToken;
        showUserNameGreeting(data.email);
        createContent(userWindowContent, activateUserWindowContent);
        mui.overlay("off");
      })
      .catch(() => {
        mui.overlay("off");
        createContent(
          '<div class="mui--text-headline">Something went wrong!. Try again!</div>'
        );
        REGISTER_BUTTON.classList.remove("d-none");
        LOGIN_BUTTON.classList.remove("d-none");
        LOGOUT_BUTTON.classList.add("d-none");
        TOGGLE_SCREEN_BUTTON.classList.add("d-none");
      });
  }
};

export const activateRegisterForm = () => {
  const registerButton = document.querySelector("#registerBtn");
  registerButton.addEventListener("click", registerFormHandler, { once: true });
};
