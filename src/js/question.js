"use strict";

// import { userName } from "./register.js";
import { authUid } from "./log-in.js";
import { registerUid } from "./register.js";

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

  static createListOfAllQuestions(users) {
    let listOfQuestions = [];
    let listOfQuestionsHTML = "";

    Object.keys(users).map((user) => {
      Object.keys(users[user]).map((question) => {
        listOfQuestions.push({ [question]: users[user][question] });
      });
    });
    listOfQuestions
      .sort((a, b) => {
        return (
          new Date(Object.values(b)[0].date) -
          new Date(Object.values(a)[0].date)
        );
      })
      .forEach((question) => {
        listOfQuestionsHTML += createStartQuestionCard(
          Object.values(question)[0],
          Object.keys(question)[0]
        );
      });
    return listOfQuestionsHTML;
  }

  static createListOfUserQuestions(questions) {
    let listOfQuestions = [];
    let listOfQuestionsHTML = "";

    Object.keys(questions).map((question) => {
      listOfQuestions.push({ [question]: questions[question] });
    });

    listOfQuestions
      .sort((a, b) => {
        return (
          new Date(Object.values(b)[0].date) -
          new Date(Object.values(a)[0].date)
        );
      })
      .forEach((question) => {
        listOfQuestionsHTML += createUserQuestionCard(
          Object.values(question)[0],
          Object.keys(question)[0]
        );
      });
    return listOfQuestionsHTML;
  }

  static renderList(listOfQuestionsHTML, target) {
    target.innerHTML = listOfQuestionsHTML;
  }

  static renderWarning(target) {
    target.innerHTML =
      '<div class="mui--text-headline">Something went wrong! Try to reload the page...</div>';
  }

  static renderMessage(target) {
    target.innerHTML =
      '<div class="mui--text-headline">You do not have any message yet.</div>';
  }

  static getAllQuestions() {
    return fetch(
      `https://ask-me-anything-cc5c2-default-rtdb.firebaseio.com/questions.json`
    )
      .then((response) => response.json())
      .then((users) => {
        return Question.createListOfAllQuestions(users);
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

    return fetch(
      `https://ask-me-anything-cc5c2-default-rtdb.firebaseio.com/questions/${
        authUid || registerUid
      }.json`
    )
      .then((response) => response.json())
      .then((questions) => {
        return Question.createListOfUserQuestions(questions);
      })
      .then((data) => {
        return Question.renderList(data, RECENT_QUESTIONS_BLOCK);
      })
      .catch(() => {
        return Question.renderMessage(RECENT_QUESTIONS_BLOCK);
      });
  }

  static delete(id, token) {
    return fetch(
      `https://ask-me-anything-cc5c2-default-rtdb.firebaseio.com/questions/${
        authUid || registerUid
      }/${id}.json?auth=${token}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
