"use strict";

import { Answer } from "./answer.js";
import { userName } from "./register.js";
import { isValidQuestion } from "./utils.js";
import { createModal } from "./utils.js";
import { authUid } from "./log-in.js";
import { registerUid } from "./register.js";
import { registerToken } from "./register.js";
import { authToken } from "./log-in.js";

const CONTENT_BLOCK = document.querySelector("#content");

const createStartQuestionCard = (
  question,
  questionId,
  authorId,
  listOfAnswers
) => {
  return `<div class="mui-panel question" data-id="${questionId}">
  <p class="question__text">${question.text}</p>
  <hr class="question__divider">
  <div class="mui--text-black-54">
    By <span class="nickName">${question.author}</span>
    <time datetime="${new Date(question.date).toLocaleDateString()}">
    ${new Date(question.date).toLocaleDateString()}
    </time>
    <time datetime="${new Date(question.date).toLocaleTimeString()}">
    ${new Date(question.date).toLocaleTimeString()}
    </time>
  </div>
  <button class="mui-btn mui-btn--primary" disabled>Answer</button>
  <div class="answers">${listOfAnswers}</div>
</div>`;
};

const createActiveQuestionCard = (
  question,
  questionId,
  authorId,
  listOfAnswers
) => {
  return `<div class="mui-panel question" data-id="${questionId}">
  <p class="question__text">${question.text}</p>
  <hr class="question__divider">
  <div class="mui--text-black-54">
    By <span class="nickName">${question.author}</span>
    <time datetime="${new Date(question.date).toLocaleDateString()}">
    ${new Date(question.date).toLocaleDateString()}
    </time>
    <time datetime="${new Date(question.date).toLocaleTimeString()}">
    ${new Date(question.date).toLocaleTimeString()}
    </time>
  </div>
  <button class="mui-btn mui-btn--primary" data-type="answerQuestion" data-questionId="${questionId}" data-authorId="${authorId}">Answer</button>
  <div class="answers">${listOfAnswers}</div>
</div>`;
};

const createUserQuestionCard = (
  question,
  questionId,
  authorId,
  listOfAnswers
) => {
  return `<div class="mui-panel question" data-id="${questionId}">
  <p class="question__text" data-content="questionText">${question.text}</p>
  <hr class="question__divider">
  <div class="mui--text-black-54">
    By <span class="nickName">${question.author}</span>
    <time datetime="${new Date(question.date).toLocaleDateString()}">
    ${new Date(question.date).toLocaleDateString()}
    </time>
    <time datetime="${new Date(question.date).toLocaleTimeString()}">
    ${new Date(question.date).toLocaleTimeString()}
    </time>
  </div>
  <button class="mui-btn mui-btn--accent delete" data-type="deleteQuestion" data-id="${questionId}">Delete</button>
  <button class="mui-btn mui-btn--accent edit" data-type="editQuestion" data-id="${questionId}">Edit</button>
  <div class="answers">${listOfAnswers}</div>
</div>`;
};

export class Question {
  static renderContent(content, target) {
    target.innerHTML = content;
  }

  static renderWarning(target) {
    target.innerHTML =
      '<div class="mui--text-headline">Something went wrong! Try to reload the page and try again...</div>';
  }

  static renderMessage(target) {
    target.innerHTML =
      '<div class="mui--text-headline">You do not have any message yet.</div>';
  }

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
        const questionContent = Object.values(question)[0];
        const questionId = Object.keys(question)[0];
        const questionAuthorId = question[questionId]["authorId"];

        let listOfAnswersHTML;

        if (question[questionId]["answers"] !== undefined) {
          const answers = question[questionId]["answers"];
          listOfAnswersHTML = Answer.createListOfAllAnswers(
            answers,
            questionAuthorId,
            questionId
          );
        } else {
          listOfAnswersHTML =
            "<div class='noAnswerMessage'>There is no answer yet.</div>";
        }

        listOfQuestionsHTML += renderMethod(
          questionContent,
          questionId,
          questionAuthorId,
          listOfAnswersHTML
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
        const firstQuestionDate = Object.values(a)[0].date;
        const secondQuestionDate = Object.values(b)[0].date;
        return new Date(secondQuestionDate) - new Date(firstQuestionDate);
      })
      .forEach((question) => {
        const questionContent = Object.values(question)[0];
        const questionId = Object.keys(question)[0];
        const questionAuthorId = question[questionId]["authorId"];

        let listOfAnswersHTML;

        if (question[questionId]["answers"] !== undefined) {
          const answers = question[questionId]["answers"];
          listOfAnswersHTML = Answer.createListOfAllAnswers(
            answers,
            questionAuthorId,
            questionId
          );
        } else {
          listOfAnswersHTML =
            "<div class='noAnswerMessage'>There is no answer yet.</div>";
        }

        listOfQuestionsHTML += createUserQuestionCard(
          questionContent,
          questionId,
          questionAuthorId,
          listOfAnswersHTML
        );
      });
    return listOfQuestionsHTML;
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
        return Question.renderContent(data, CONTENT_BLOCK);
      })
      .catch(() => {
        return Question.renderWarning(CONTENT_BLOCK);
      });
  }

  static activateAllQuestions() {
    const allQuestionsWrapper = CONTENT_BLOCK.querySelector(
      "#allQuestionsWrapper"
    );
    allQuestionsWrapper.addEventListener("click", ({ target }) => {
      if (
        target.hasAttribute("data-type") &&
        target.getAttribute("data-type") === "answerQuestion"
      ) {
        const questionId = target.getAttribute("data-questionId");
        const authorId = target.getAttribute("data-authorId");
        createModal(`<form id="formNewAnswer" class="mui-form">
                      <div class="mui-textfield mui-textfield--float-label">
                        <input id="answerInput" type="text"" required minlength="10" maxlength="256"/>
                        <label for="answerInput">Your answer...</label>
                      </div>
                      <button id="submitAnswer" type="submit" class="mui-btn mui-btn--primary mui-btn--fab" disabled>
                        DONE
                      </button>
                    </form>`);
        const answerForm = document.querySelector("#formNewAnswer");
        const answerInput = answerForm.querySelector("#answerInput");
        const answerSubmitBtn = answerForm.querySelector("#submitAnswer");

        const answerFormHandler = () => {
          if (isValidQuestion(answerInput.value)) {
            answerSubmitBtn.disabled = false;
            answerForm.addEventListener("submit", submitAnswerFormHandler, {
              once: true,
            });
          }
        };

        const submitAnswerFormHandler = (e) => {
          e.preventDefault();

          const answerText = answerInput.value;

          const newAnswer = {
            author: userName,
            text: answerText.trim(),
            date: new Date().toJSON(),
            authorId: authUid || registerUid,
          };

          mui.overlay("off");

          Answer.create(
            newAnswer,
            questionId,
            authorId,
            authToken || registerToken
          )
            .then(() => {
              Question.getAllActiveQuestions();
            })
            .catch(() => {
              createModal(
                '<div class="mui--text-headline">Something went wrong! Try to create your answer one more time.</div>'
              );
            });
        };

        answerInput.addEventListener("input", () => {
          answerFormHandler();
        });
      } else if (
        target.hasAttribute("data-type") &&
        target.getAttribute("data-type") === "deleteAnswer"
      ) {
        Answer.delete(
          target.getAttribute("data-questionAuthor"),
          target.getAttribute("data-questionId"),
          target.getAttribute("data-answerId")
        )
          .then(() => {
            Question.getAllActiveQuestions();
          })
          .catch(() => {
            createModal(
              '<div class="mui--text-headline">Something went wrong! Try to delete your answer one more time.</div>'
            );
          });
      } else if (
        target.hasAttribute("data-type") &&
        target.getAttribute("data-type") === "editAnswer"
      ) {
        // Answer.delete(
        //   target.getAttribute("data-questionAuthor"),
        //   target.getAttribute("data-questionId"),
        //   target.getAttribute("data-answerId")
        // )
        //   .then(() => {
        //     Question.getAllActiveQuestions();
        //   })
        //   .catch(() => {
        //     createModal(
        //       '<div class="mui--text-headline">Something went wrong! Try to delete your answer one more time.</div>'
        //     );
        //   });

        const questionAuthorId = target.getAttribute("data-questionAuthor");
        const questionId = target.getAttribute("data-questionId");
        const answerId = target.getAttribute("data-answerId");

        const text = document.querySelector(
          `div[data-answerId="${answerId}"] [data-content="answerText"]`
        ).innerHTML;
        createModal(`<form id="formEditAnswer" class="mui-form">
                  <div class="mui-textfield mui-textfield--float-label">
                    <input id="answerEditInput" type="text" value="${text}" required minlength="10" maxlength="256"/>
                  </div>
                  <button id="submitEditedAnswer" type="submit" class="mui-btn mui-btn--primary mui-btn--fab" disabled>
                    DONE
                  </button>
                </form>`);
        const answerEditForm = document.querySelector("#formEditAnswer");
        const answerEditInput = answerEditForm.querySelector(
          "#answerEditInput"
        );
        const answerEditSubmitBtn = answerEditForm.querySelector(
          "#submitEditedAnswer"
        );

        const editAnswerFormHandler = () => {
          if (isValidQuestion(answerEditInput.value)) {
            answerEditSubmitBtn.disabled = false;
            answerEditForm.addEventListener(
              "submit",
              submitEditedAnswerFormHandler,
              {
                once: true,
              }
            );
          }
        };

        const submitEditedAnswerFormHandler = (e) => {
          e.preventDefault();

          const editedText = answerEditInput.value;

          const editedAnswer = {
            author: userName,
            text: editedText.trim(),
            date: new Date().toJSON(),
          };

          mui.overlay("off");

          Answer.edit(questionAuthorId, questionId, answerId, editedAnswer)
            .then(() => {
              Question.getAllActiveQuestions();
            })
            .catch(() => {
              createModal(
                '<div class="mui--text-headline">Something went wrong! Try to edit your answer one more time.</div>'
              );
            });
        };

         answerEditInput.addEventListener("input", () => {
           editAnswerFormHandler();
         });
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
        const render = () => {
          Question.renderContent(
            '<div id="allQuestionsWrapper"></div>',
            CONTENT_BLOCK
          );
          const allQuestionsWrapper = CONTENT_BLOCK.querySelector(
            "#allQuestionsWrapper"
          );
          Question.renderContent(data, allQuestionsWrapper);
        };
        return render();
      })
      .then(() => {
        return Question.activateAllQuestions();
      })
      .catch(() => {
        return Question.renderWarning(CONTENT_BLOCK);
      });
  }

  static activateUserQuestions() {
    const userRecentQuestionsBlock = document.querySelector(
      "#userRecentQuestions"
    );
    userRecentQuestionsBlock.addEventListener("click", ({ target }) => {
      if (
        target.hasAttribute("data-type") &&
        target.getAttribute("data-type") === "deleteQuestion"
      ) {
        Question.delete(
          target.getAttribute("data-id"),
          authToken || registerToken
        )
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
          `div[data-id="${questionId}"] [data-content="questionText"]`
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

        const editQuestionFormHandler = () => {
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
          editQuestionFormHandler();
        });
      } else if (
        target.hasAttribute("data-type") &&
        target.getAttribute("data-type") === "deleteAnswer"
      ) {
        Answer.delete(
          target.getAttribute("data-questionAuthor"),
          target.getAttribute("data-questionId"),
          target.getAttribute("data-answerId")
        )
          .then(() => {
            Question.getRecentUserQuestions();
          })
          .catch(() => {
            createModal(
              '<div class="mui--text-headline">Something went wrong! Try to delete your answer one more time.</div>'
            );
          });
      }
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
        return Question.renderContent(data, RECENT_QUESTIONS_BLOCK);
      })
      .then((data) => {
        return Question.activateUserQuestions();
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
        method: "PATCH",
        body: JSON.stringify(editedQuestion),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
