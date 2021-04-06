"use strict";

import { authUid } from "./log-in.js";
import { registerUid } from "./register.js";

export class Answer {
  static create(newAnswer, id, token) {
    return fetch(
      `https://ask-me-anything-cc5c2-default-rtdb.firebaseio.com/questions/${
        authUid || registerUid
      }/${id}.json?auth=${token}`,
      {
        method: "PUT",
        body: JSON.stringify(newAnswer),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
