"use strict";

import { authUid } from "./log-in.js";
import { registerUid } from "./register.js";

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
}
