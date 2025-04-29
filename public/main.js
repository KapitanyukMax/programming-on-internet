let wasBlured = false;

function onFormSelectChange(select) {
  if (select.options[select.selectedIndex].disabled) {
    select.classList.add("disabled-selected");
  } else {
    select.classList.remove("disabled-selected");
  }
}

function onFormCancel() {
  document.getElementById("student-form").reset();
  document.getElementById("student-form").classList.add("invisible");
  document.getElementById("background-blurer").classList.add("invisible");
}

function showDeleteModal(deletedStudentName) {
  document.getElementById("background-blurer").classList.remove("invisible");
  document.getElementById("delete-modal").classList.remove("invisible");
  document.getElementById("delete-modal-message").textContent =
    deletedStudentName
      ? `Are you sure you want to delete user ${deletedStudentName}?`
      : "Are you sure you want to delete the users?";
}

function showErrorModal(error) {
  if (
    document.getElementById("background-blurer").classList.contains("invisible")
  ) {
    document.getElementById("background-blurer").classList.remove("invisible");
  } else {
    wasBlured = true;
  }

  document.getElementById("error-modal").classList.remove("invisible");
  document.getElementById("error-modal-message").textContent = error;
}

function hideErrorModal() {
  if (!wasBlured) {
    document.getElementById("background-blurer").classList.add("invisible");
  }

  document.getElementById("error-modal-message").textContent = "";
  document.getElementById("error-modal").classList.add("invisible");
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
      iframe.contentWindow.document.body.scrollHeight + 2 + "px";
  }
}

document.getElementById("content").onload = adjustIframeHeight;
