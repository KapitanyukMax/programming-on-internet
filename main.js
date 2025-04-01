const nameRegex = /^[A-Z][a-z]*(?:[-'][A-Z][a-z]*)*$/;

function getNameRegex() {
  return nameRegex;
}

function isAgeInRange(birthdateString, minAge, maxAge) {
  const birthdate = new Date(birthdateString);
  const today = new Date();

  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  const dayDiff = today.getDate() - birthdate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age >= minAge && age <= maxAge;
}

function onFormSelectChange(select) {
  let errorElementId = "group-error";
  if (select.id === "gender") {
    errorElementId = "gender-error";
  }

  if (select.options[select.selectedIndex].disabled) {
    select.classList.add("disabled-selected");
  } else {
    select.classList.remove("invalid-field");
    document.getElementById(errorElementId).classList.add("white-text");
    document.getElementById(errorElementId).classList.remove("red-text");
    select.classList.remove("disabled-selected");
  }
}

function onNameInputChange(nameInput) {
  let errorElementId = "first-name-error";
  if (nameInput.id === "last-name") {
    errorElementId = "last-name-error";
  }

  if (
    nameInput.value &&
    nameRegex.test(nameInput.value) &&
    nameInput.value.length > 2
  ) {
    nameInput.classList.remove("invalid-field");
    document.getElementById(errorElementId).classList.add("white-text");
    document.getElementById(errorElementId).classList.remove("red-text");
  }
}

function onFormDateInputChange(dateInput) {
  if (dateInput.value) {
    if (isAgeInRange(dateInput.value, 13, 100)) {
      dateInput.classList.remove("invalid-field");
      document.getElementById("birthday-error").classList.add("white-text");
      document.getElementById("birthday-error").classList.remove("red-text");
      dateInput.classList.add("filled-field");
    } else {
      document.getElementById("birthday-error").textContent = "Invalid age";

      if (!dateInput.classList.contains("invalid-field")) {
        dateInput.classList.add("filled-field");
      }
    }
  } else {
    dateInput.classList.remove("filled-field");
    document.getElementById("birthday-error").textContent =
      "Enter a birthday please";
  }
}

function onFormCancel() {
  document.getElementById("student-form").reset();
  document.getElementById("student-form").classList.add("invisible");
  document.getElementById("background-blurer").classList.add("invisible");
}

function onNotificationMouseEnter() {
  document.getElementById("chat-preview").classList.remove("invisible");
}

function onNotificationMouseLeave() {
  document.getElementById("chat-preview").classList.add("invisible");
}

function onProfileMouseEnter() {
  document
    .getElementById("profile-menu-container")
    .classList.remove("invisible");
}

function onProfileMouseLeave() {
  document.getElementById("profile-menu-container").classList.add("invisible");
}

function loadPage(page) {
  document.getElementById("content").src = `${page}.html`;

  document
    .querySelectorAll("menu.sidebar-menu button")
    .forEach((button) => button.classList.remove("selected-page"));

    document.getElementById(`${page}-btn`).classList.add("selected-page");
}

function adjustIframeHeight() {
  let iframe = document.getElementById("content");
  if (iframe.contentWindow.document.body) {
    iframe.style.height =
      iframe.contentWindow.document.body.scrollHeight + "px";
  }
}

document.getElementById("content").onload = adjustIframeHeight;
