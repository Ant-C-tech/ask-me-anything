"use strict";

import { Question } from "./question.js";
import { createModal } from "./utils.js";
import { createContent } from "./utils.js";
import { logInContent } from "./log-in.js";
import { activateLogInForm } from "./log-in.js";
import { logOut } from "./log-in.js";
import { userWindowContent } from "./user-window.js";
import { activateUserWindowContent } from "./user-window.js";


const changeScreen = ({ target }) => {
  if (target.innerText == "ALL") {
    Question.getAllQuestions();
    target.innerHTML = "Profile";
  } else {
    createContent(userWindowContent, activateUserWindowContent);
    target.innerHTML = "ALL";
  }
};

window.addEventListener("load", Question.getAllQuestions);
document.querySelector("#logIn").addEventListener("click", () => {
  createModal(logInContent, activateLogInForm);
});
document.querySelector("#logOut").addEventListener("click", logOut);
document.querySelector("#toggleScreen").addEventListener("click", changeScreen);
