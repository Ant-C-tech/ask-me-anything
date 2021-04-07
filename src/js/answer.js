"use strict";

import { authUid } from "./log-in.js";
import { registerUid } from "./register.js";

const createStartAnswerCard = (answer, answerId) => {
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

  static createListOfAllAnswers(answers) {
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
        listOfAnswersHTML += createStartAnswerCard(answerContent, answerId);
      });

    return listOfAnswersHTML;
  }
}
