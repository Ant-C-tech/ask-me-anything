"use strict";

import { Question } from "./question.js";
import { createModal } from "./utils.js";
import { createContent } from "./utils.js";
import { logInContent } from "./log-in.js";
import { activateLogInForm } from "./log-in.js";
import { logOut } from "./log-in.js";
import { userWindowContent } from "./user-window.js";
import { activateUserWindowContent } from "./user-window.js";
import { registerContent } from "./register.js";
import { activateRegisterForm } from "./register.js";
import { TOGGLE_SCREEN_BUTTON } from "./register.js";
import { LOGIN_BUTTON } from "./register.js";
import { LOGOUT_BUTTON } from "./register.js";
import { REGISTER_BUTTON } from "./register.js";

const changeScreen = () => {
  if (TOGGLE_SCREEN_BUTTON.innerText == "ALL") {
    const getAllActiveQuestions = new Promise((resolve) => {
      TOGGLE_SCREEN_BUTTON.classList.add("d-none");
      resolve(Question.getAllActiveQuestions());
    });

    getAllActiveQuestions
      .then(() => {
        TOGGLE_SCREEN_BUTTON.classList.remove("d-none");
        TOGGLE_SCREEN_BUTTON.innerHTML = "Profile";
      })
      .catch(() => {
        return Question.renderWarning(CONTENT_BLOCK);
      });
  } else {
    const showUserWindow = new Promise((resolve) => {
      TOGGLE_SCREEN_BUTTON.classList.add("d-none");
      resolve(createContent(userWindowContent, activateUserWindowContent));
    });

    showUserWindow
      .then(() => {
        TOGGLE_SCREEN_BUTTON.classList.remove("d-none");
        TOGGLE_SCREEN_BUTTON.innerHTML = "ALL";
      })
      .catch(() => {
        return Question.renderWarning(CONTENT_BLOCK);
      });
  }
};

window.addEventListener("load", Question.getAllQuestions, { once: true });
document.addEventListener("click", ({ target }) => {
  if (target === LOGIN_BUTTON) {
    createModal(logInContent, activateLogInForm);
  } else if (target === LOGOUT_BUTTON) {
    logOut();
  } else if (target === REGISTER_BUTTON) {
    createModal(registerContent, activateRegisterForm);
  } else if (target === TOGGLE_SCREEN_BUTTON) {
    changeScreen();
  }
});
