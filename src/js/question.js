"use strict";

import { userName } from "./register.js";

const CONTENT_BLOCK = document.querySelector("#content");

const createQuestionCard = (question) => {
  return `<div class="mui-panel">
  <p class="question__text">${question.text}</p>
  <hr class="question__divider">
  <div class="mui--text-black-54">
    By <a href="#">${question.author}</a>
    <time datetime="${new Date(question.date).toLocaleDateString()}">
    ${new Date(question.date).toLocaleDateString()}
    </time>
    <time datetime="${new Date(question.date).toLocaleTimeString()}">
    ${new Date(question.date).toLocaleTimeString()}
    </time>
  </div>
</div>`;
};

export class Question {
  static create(newQuestion, token) {
    return fetch(
      `https://ask-me-anything-cc5c2-default-rtdb.firebaseio.com/questions.json?auth=${token}`,
      {
        method: "POST",
        body: JSON.stringify(newQuestion),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  static renderList(questions, target) {
    let htmlListOfQuestions = Object.keys(questions)
      .map((key) => {
        return createQuestionCard(questions[key]);
      })
      .join(" ");

    target.innerHTML = htmlListOfQuestions;
  }

  static renderWarning(target) {
    target.innerHTML =
      '<div class="mui--text-headline">Something went wrong! Try to reload the page...</div>';
  }

  static getAllQuestions() {
    return fetch(
      `https://ask-me-anything-cc5c2-default-rtdb.firebaseio.com/questions.json`
    )
      .then((response) => response.json())
      .then((questions) => {
        if (questions !== null) {
          Question.renderList(questions, CONTENT_BLOCK);
        } else {
          Question.renderWarning(CONTENT_BLOCK);
        }
      });
  }

  static getRecentUserQuestions() {
    const RECENT_QUESTIONS_BLOCK = document.querySelector(
      "#userRecentQuestions"
    );

    const getUserName = new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (userName !== undefined) {
          clearInterval(interval);
          resolve(userName);
        }
      }, 200);
    });

    getUserName.then((data) => {
      return fetch(
        `https://ask-me-anything-cc5c2-default-rtdb.firebaseio.com/questions.json?orderBy="author"&equalTo="${data}"&print=pretty"`
      )
        .then((response) => response.json())
        .then((questions) => {
          if (questions !== null) {
            Question.renderList(questions, RECENT_QUESTIONS_BLOCK);
          } else {
            Question.renderWarning(RECENT_QUESTIONS_BLOCK);
          }
        });
    });
  }
}
