"use strict";
import { isValidQuestion } from "./utils.js";
import { createModal } from "./utils.js";
import { Question } from "./question.js";
import { userName } from "./register.js";
import { registerToken } from "./register.js";
import { authToken } from "./log-in.js";
import { authUid } from "./log-in.js";
import { registerUid } from "./register.js";

let newQuestionForm;
let newQuestionInput;
let newQuestionSubmit;
let userRecentQuestionsBlock;

const getElements = () => {
  newQuestionForm = document.querySelector("#formNewQuestion");
  newQuestionInput = newQuestionForm.querySelector("#questionInput");
  newQuestionSubmit = newQuestionForm.querySelector("#submitQuestion");
  userRecentQuestionsBlock = document.querySelector("#userRecentQuestions");
};

const submitFormHandler = (e) => {
  e.preventDefault();

  const newQuestion = {
    author: userName,
    text: newQuestionInput.value.trim(),
    date: new Date().toJSON(),
    answers: "There is no answer yet.",
  };

  newQuestionSubmit.disabled = true;
  Question.create(
    newQuestion,
    authToken || registerToken,
    authUid || registerUid
  )
    .then(() => {
      newQuestionInput.value = "";
      newQuestionInput.className = "";
      Question.getRecentUserQuestions();
    })
    .catch(() => {
      createModal(
        '<div class="mui--text-headline">Something went wrong! Try to create your question again.</div>'
      );
    });
};

//  && (authToken || registerToken)
const inputNewQuestionFormHandler = () => {
  if (isValidQuestion(newQuestionInput.value)) {
    newQuestionSubmit.disabled = false;
    newQuestionForm.addEventListener("submit", submitFormHandler, {
      once: true,
    });
  }
};

const userQuestionsHandler = ({ target }) => {
  if (
    target.hasAttribute("data-type") &&
    target.getAttribute("data-type") === "deleteQuestion"
  ) {
    Question.delete(target.getAttribute("data-id"), authToken || registerToken)
      .then(() => {
        Question.getRecentUserQuestions();
      })
      .catch(() => {
        createModal(
          '<div class="mui--text-headline">Something went wrong! Try to delete your question again.</div>'
        );
      });
  } else if (
    target.hasAttribute("data-type") &&
    target.getAttribute("data-type") === "editQuestion"
  ) {
    const questionId = target.getAttribute("data-id");
    const text = document.querySelector(
      `div[data-id="${questionId}"] #questionText`
    ).innerHTML;
    createModal(`<form id="formEditQuestion" class="mui-form">
                  <div class="mui-textfield mui-textfield--float-label">
                    <input id="questionEditInput" type="text" value="${text}" required minlength="10" maxlength="256"/>
                  </div>
                  <button id="submitEditedQuestion" type="submit" class="mui-btn mui-btn--primary mui-btn--fab" disabled>
                    DONE
                  </button>
                </form>`);
    const questionEditForm = document.querySelector("#formEditQuestion");
    const questionEditInput = questionEditForm.querySelector(
      "#questionEditInput"
    );
    const questionEditSubmitBtn = questionEditForm.querySelector(
      "#submitEditedQuestion"
    );

    const inputEditQuestionFormHandler = () => {
      if (isValidQuestion(questionEditInput.value)) {
        questionEditSubmitBtn.disabled = false;
        questionEditForm.addEventListener(
          "submit",
          submitEditedQuestionFormHandler,
          {
            once: true,
          }
        );
      }
    };

    const submitEditedQuestionFormHandler = (e) => {
      e.preventDefault();

      const editedText = questionEditInput.value;

      const editedQuestion = {
        author: userName,
        text: editedText.trim(),
        date: new Date().toJSON(),
      };

      mui.overlay("off");

      Question.edit(editedQuestion, questionId, authToken || registerToken)
        .then(() => {
          Question.getRecentUserQuestions();
        })
        .catch(() => {
          createModal(
            '<div class="mui--text-headline">Something went wrong! Try to edit your question one more time.</div>'
          );
        });
    };

    questionEditInput.addEventListener("input", () => {
      inputEditQuestionFormHandler(
        questionEditForm,
        questionEditInput,
        questionEditSubmitBtn
      );
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
  Question.getRecentUserQuestions();
  newQuestionInput.addEventListener("input", inputNewQuestionFormHandler);
  userRecentQuestionsBlock.addEventListener("click", userQuestionsHandler);
};
