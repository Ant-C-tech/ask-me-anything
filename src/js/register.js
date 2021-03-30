'use strict'

export const API_KEY = "AIzaSyBumV9Ic_eoFB0Wx5CDXPh4YveIo2X4aF0";

export const REGISTER_BUTTON = document.querySelector("#register");
export const USER_NAME_BLOCK = document.querySelector("#userName");
export const TOGGLE_SCREEN_BUTTON = document.querySelector("#toggleScreen");
export const LOGIN_BUTTON = document.querySelector("#logIn");
export const LOGOUT_BUTTON = document.querySelector("#logOut");

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
      required
    />
    <label for="passwordInput">Your Password...</label>
  </div>
  <button
    id="registerBtn"
    type="submit"
    class="mui-btn mui-btn--primary"
    disabled
  >
    Create
  </button>
</form>`;

export const activateRegisterForm = () => {

}
