"use strict";

import { userName } from "./register.js";

const CONTENT_BLOCK = document.querySelector("#content");

const createStartQuestionCard = (question, id) => {
  return `<div class="mui-panel" data-id="${id}">
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

const createUserQuestionCard = (question, id) => {
  return `<div class="mui-panel" data-id="${id}">
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
  <button id="deleteQuestion" class="mui-btn mui-btn--accent" data-id="${id}">Delete</button>
  <button id="editQuestion" class="mui-btn mui-btn--accent" data-id="${id}">Edit</button>
</div>`;
};

export class Question {
  static create(newQuestion, token, uId) {
    return fetch(
      `https://ask-me-anything-cc5c2-default-rtdb.firebaseio.com/questions/${uId}.json?auth=${token}`,
      {
        method: "POST",
        body: JSON.stringify(newQuestion),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  static createList(questions, renderMethod) {
    let listOfQuestions = Object.keys(questions)
      .sort((a, b) => {
        return new Date(questions[b].date) - new Date(questions[a].date);
      })
      .map((key) => {
        return renderMethod(questions[key], key);
      })
      .join(" ");
    return listOfQuestions;
  }

  static renderList(listOfQuestionsHTML, target) {
    target.innerHTML = listOfQuestionsHTML;
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
        return Question.createList(questions, createStartQuestionCard);
      })
      .then((data) => {
        return Question.renderList(data, CONTENT_BLOCK);
      })
      .catch(() => {
        return Question.renderWarning(CONTENT_BLOCK);
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
          return Question.createList(questions, createUserQuestionCard);
        })
        .then((data) => {
          return Question.renderList(data, RECENT_QUESTIONS_BLOCK);
        })
        .catch(() => {
          return Question.renderWarning(RECENT_QUESTIONS_BLOCK);
        });
    });
  }

  static delete(id, token) {
    return fetch(
      `https://ask-me-anything-cc5c2-default-rtdb.firebaseio.com/questions/${id}.json?auth=${token}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
