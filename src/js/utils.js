"use strict";

const CONTENT_BLOCK = document.querySelector("#content");

export const isValidQuestion = (value) => {
  return value.length >= 10 && value.length <= 256;
};

export const isValidPassword = (value) => {
  return value.length >= 6;
};

export const createModal = (content, callBack) => {
  // initialize modal element
  const modalEl = document.createElement("div");
  modalEl.style.width = "400px";
  modalEl.style.height = "300px";
  modalEl.style.margin = "100px auto";
  modalEl.style.padding = "20px";
  modalEl.style.backgroundColor = "#fff";
  modalEl.innerHTML = content;

  // show modal
  mui.overlay("on", modalEl);

  callBack && callBack();
};

export const createContent = (content, callBack) => {
  CONTENT_BLOCK.innerHTML = content;
  callBack && callBack();
};

export const isValidEmail = (email) => {
  const regexEmailValidation = /\S+@\S+\.\S+/;
  return regexEmailValidation.test(email);
};
