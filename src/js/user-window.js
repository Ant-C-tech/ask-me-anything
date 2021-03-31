"use strict";
import { isValidQuestion } from "./utils.js";
import { Question } from "./question.js";
import { authToken } from "./log-in.js";
import { userName } from "./register.js";

let newQuestionForm;
let newQuestionInput;
let newQuestionSubmit;

const getElements = () => {
  newQuestionForm = document.querySelector("#formNewQuestion");
  newQuestionInput = newQuestionForm.querySelector("#questionInput");
  newQuestionSubmit = newQuestionForm.querySelector("#submitQuestion");
};

const submitFormHandler = (e) => {
  e.preventDefault();

  const newQuestion = {
    author: userName,
    text: newQuestionInput.value.trim(),
    date: new Date().toJSON(),
  };

  newQuestionSubmit.disabled = true;
  Question.create(newQuestion, authToken).then(() => {
    newQuestionInput.value = "";
    newQuestionInput.className = "";
    Question.getRecentUserQuestions();
  });
};

const inputFormHandler = () => {
  if (isValidQuestion(newQuestionInput.value) && authToken) {
    newQuestionSubmit.disabled = false;
    newQuestionForm.addEventListener("submit", submitFormHandler, {
      once: true,
    });
  }
};

export const userWindowContent = `<div class="mui-row">
        <div class="mui-col-sm-10 mui-col-sm-offset-1">
          <br />
          <br />
          <div class="mui-appbar mui--text-headline">
            NEW QUESTION
          </div>
          <div class="mui-divider"></div>
          <br />

          <form id="formNewQuestion" class="mui-form">
            <div class="mui-textfield mui-textfield--float-label">
              <input id="questionInput" type="text" required minlength="10" maxlength="256"/>
              <label for="questionInput">Your question...</label>
            </div>
            <button id="submitQuestion" type="submit" class="mui-btn mui-btn--primary mui-btn--fab" disabled>
              ASK
            </button>
          </form>

          <div class="mui-appbar mui--text-headline">
            YOUR RECENT QUESTIONS
          </div>
          <div class="mui-divider"></div>
          <br />

          <div id="userRecentQuestions"></div>

        </div>
      </div>`;

export const activateUserWindowContent = () => {
  getElements();
  Question.getRecentUserQuestions()
  newQuestionInput.addEventListener("input", inputFormHandler);
};
