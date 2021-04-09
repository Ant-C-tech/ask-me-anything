"use strict";

import { authUid } from "./log-in.js";
import { registerUid } from "./register.js";
import { registerToken } from "./register.js";
import { authToken } from "./log-in.js";

const createCommonAnswerCard = (answer, answerId) => {
  return `<div class="mui-panel answer" data-id="${answerId}">
            <p class="answer__text">${answer.text}</p>
            <hr class="question__divider">
            <div class="mui--text-black-54">
              By <span class="nickName">${answer.author}</span>
              <time datetime="${new Date(answer.date).toLocaleDateString()}">
                ${new Date(answer.date).toLocaleDateString()}
              </time>
              <time datetime="${new Date(answer.date).toLocaleTimeString()}">
              ${new Date(answer.date).toLocaleTimeString()}
              </time>
            </div>
          </div>`;
};

const createUserAnswerCard = (
  answer,
  questionAuthorId,
  questionId,
  answerId
) => {
  return `<div class="mui-panel answer" data-id="${answerId}">
            <p class="answer__text">${answer.text}</p>
            <hr class="question__divider">
            <div class="mui--text-black-54">
              By <span class="nickName">${answer.author}</span>
              <time datetime="${new Date(answer.date).toLocaleDateString()}">
                ${new Date(answer.date).toLocaleDateString()}
              </time>
              <time datetime="${new Date(answer.date).toLocaleTimeString()}">
              ${new Date(answer.date).toLocaleTimeString()}
              </time>
            </div>
            <button class="mui-btn mui-btn--accent delete" data-type="deleteAnswer" data-questionAuthor="${questionAuthorId}" data-questionId="${questionId}" data-answerId="${answerId}">Delete</button>
            <button class="mui-btn mui-btn--accent edit" data-type="editAnswer" data-questionAuthor="${questionAuthorId}" data-questionId="${questionId}" data-answerId="${answerId}">Edit</button>
          </div>`;
};

export class Answer {
  static create(newAnswer, questionId, authorId, token) {
    return fetch(
      `https://ask-me-anything-cc5c2-default-rtdb.firebaseio.com/questions/${authorId}/${questionId}/answers/${
        authUid || registerUid
      }.json?auth=${token}`,
      {
        method: "POST",
        body: JSON.stringify(newAnswer),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  static createListOfAllAnswers(answers, questionAuthorId, questionId) {
    let listOfAnswers = [];
    let listOfAnswersHTML = "";

    Object.keys(answers).map((user) => {
      Object.keys(answers[user]).map((answer) => {
        listOfAnswers.push({ [answer]: answers[user][answer] });
      });
    });

    listOfAnswers
      .sort((a, b) => {
        if (listOfAnswers.length > 1) {
          const firstAnswerDate = Object.values(a)[0].date;
          const secondAnswerDate = Object.values(b)[0].date;
          return new Date(secondAnswerDate) - new Date(firstAnswerDate);
        }
      })
      .forEach((answer) => {
        const answerContent = Object.values(answer)[0];
        const answerId = Object.keys(answer)[0];
        const authorId = answer[answerId]["authorId"];
        if (authUid == authorId || registerUid == authorId) {
          listOfAnswersHTML += createUserAnswerCard(
            answerContent,
            questionAuthorId,
            questionId,
            answerId
          );
        } else {
          listOfAnswersHTML += createCommonAnswerCard(
            answerContent,
            questionId,
            answerId
          );
        }
      });

    return listOfAnswersHTML;
  }

  static delete(questionAuthor, questionId, answerId) {
    return fetch(
      `https://ask-me-anything-cc5c2-default-rtdb.firebaseio.com/questions/${questionAuthor}/${questionId}/answers/${
        authUid || registerUid
      }/${answerId}.json?auth=${authToken || registerToken}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
