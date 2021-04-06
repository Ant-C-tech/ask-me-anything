"use strict";

// import { userName } from "./register.js";
import { authUid } from "./log-in.js";
import { registerUid } from "./register.js";

const CONTENT_BLOCK = document.querySelector("#content");

const createStartQuestionCard = (question, id) => {
  return `<div class="mui-panel question" data-id="${id}">
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
  <button class="mui-btn mui-btn--primary" data-type="answerQuestion" data-id="${id}" disabled>Answer</button>
</div>`;
};

const createActiveQuestionCard = (question, id) => {
  return `<div class="mui-panel question" data-id="${id}">
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
  <button class="mui-btn mui-btn--primary" data-type="answerQuestion" data-id="${id}">Answer</button>
</div>`;
};

const createUserQuestionCard = (question, id) => {
  return `<div class="mui-panel question" data-id="${id}">
  <p id="questionText" class="question__text">${question.text}</p>
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
  <button class="mui-btn mui-btn--accent deleteQuestion" data-type="deleteQuestion" data-id="${id}">Delete</button>
  <button class="mui-btn mui-btn--accent editQuestion" data-type="editQuestion" data-id="${id}">Edit</button>
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

  static createListOfAllQuestions(users, renderMethod) {
    let listOfQuestions = [];
    let listOfQuestionsHTML = "";

    Object.keys(users).map((user) => {
      Object.keys(users[user]).map((question) => {
        listOfQuestions.push({ [question]: users[user][question] });
      });
    });
    listOfQuestions
      .sort((a, b) => {
        const firstQuestionDate = Object.values(a)[0].date;
        const secondQuestionDate = Object.values(b)[0].date;
        return new Date(secondQuestionDate) - new Date(firstQuestionDate);
      })
      .forEach((question) => {
        const questionText = Object.values(question)[0];
        const questionId = Object.keys(question)[0];
        listOfQuestionsHTML += renderMethod(questionText, questionId);
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
        const firstQuestionDate = Object.values(a)[0].date;
        const secondQuestionDate = Object.values(b)[0].date;
        return new Date(secondQuestionDate) - new Date(firstQuestionDate);
      })
      .forEach((question) => {
        const questionText = Object.values(question)[0];
        const questionId = Object.keys(question)[0];
        listOfQuestionsHTML += createUserQuestionCard(questionText, questionId);
      });
    return listOfQuestionsHTML;
  }

  static renderList(listOfQuestionsHTML, target) {
    target.innerHTML = listOfQuestionsHTML;
  }

  static renderWarning(target) {
    target.innerHTML =
      '<div class="mui--text-headline">Something went wrong! Try to reload the page and try again...</div>';
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
        return Question.createListOfAllQuestions(
          users,
          createStartQuestionCard
        );
      })
      .then((data) => {
        return Question.renderList(data, CONTENT_BLOCK);
      })
      .catch(() => {
        return Question.renderWarning(CONTENT_BLOCK);
      });
  }

  static activateAllQuestions () {
    CONTENT_BLOCK.addEventListener("click", ({ target }) => {
      if (
        target.hasAttribute("data-type") &&
        target.getAttribute("data-type") === "answerQuestion"
      ) {
        alert("Work");
      }
    });
  }

  static getAllActiveQuestions() {
    return fetch(
      `https://ask-me-anything-cc5c2-default-rtdb.firebaseio.com/questions.json`
    )
      .then((response) => response.json())
      .then((users) => {
        return Question.createListOfAllQuestions(
          users,
          createActiveQuestionCard
        );
      })
      .then((data) => {
        return Question.renderList(data, CONTENT_BLOCK);
      })
      .then((data) => {
        return Question.activateAllQuestions();
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

  static edit(editedQuestion, id, token) {
    return fetch(
      `https://ask-me-anything-cc5c2-default-rtdb.firebaseio.com/questions/${
        authUid || registerUid
      }/${id}.json?auth=${token}`,
      {
        method: "PUT",
        body: JSON.stringify(editedQuestion),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
