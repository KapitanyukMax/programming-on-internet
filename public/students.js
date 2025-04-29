const baseUrl = "http://localhost/programming-on-internet";

let formState = "add";
let edittedStudentId = null;
let students = [];
let studentsIdsToDelete = [];
let isMultipleDelete = false;

const parentDoc = window.parent.document;

async function apiRequest(apiUrl, method, body) {
  console.log(`Request: ${method} ${apiUrl}`);
  if (body) console.log("Request body:", body);

  const res = await fetch(baseUrl + apiUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }

  console.log("Response:", data);
  return data;
}

function resizeParent() {
  if (window.parent && window.parent.adjustIframeHeight) {
    window.parent.adjustIframeHeight();
  }
}

async function refillStudentsTable() {
  try {
    const data = await apiRequest("/api/students", "GET");
    students = data.students ?? [];
  } catch (error) {
    console.log(error);
    return;
  }

  const studentsTableBody = document.querySelector(
    "table#students-table tbody"
  );

  studentsTableBody.innerHTML = "";

  students.forEach((student, index) => {
    const row = document.createElement("tr");

    const checkboxCell = document.createElement("td");
    checkboxCell.classList.add("col-1");
    checkboxCell.innerHTML = `<input
      type="checkbox"
      onchange="onStudentCheckboxChange(this)"
      id="checkbox-${student.id}"
      data-id="${student.id}"
    />`;
    row.appendChild(checkboxCell);

    const groupCell = document.createElement("td");
    groupCell.classList.add("col-2");
    groupCell.textContent = student.group;
    row.appendChild(groupCell);

    const nameCell = document.createElement("td");
    nameCell.classList.add("col-3");
    nameCell.textContent = `${student.firstName} ${student.lastName}`;
    row.appendChild(nameCell);

    const genderCell = document.createElement("td");
    genderCell.classList.add("col-4");
    genderCell.textContent = student.gender;
    row.appendChild(genderCell);

    const birthdayCell = document.createElement("td");
    birthdayCell.classList.add("col-5");
    const [year, month, day] = student.birthday.split("-");
    birthdayCell.textContent = `${day}.${month}.${year}`;
    row.appendChild(birthdayCell);

    const statusCell = document.createElement("td");
    statusCell.classList.add("col-6");
    const spanElement = document.createElement("span");
    spanElement.classList.add("status");
    if (index === 0) {
      spanElement.classList.add("active");
    }
    statusCell.appendChild(spanElement);
    row.appendChild(statusCell);

    const optionsCell = document.createElement("td");
    optionsCell.classList.add("col-7");
    optionsCell.innerHTML = `<div class="student-menu">
      <button
        type="button"
        class="square-btn icon-btn edit-btn"
        onclick="onEditStudentClick(${student.id})"
      >
        <svg
          width="800px"
          height="800px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 10L21 7L17 3L14 6M18 10L8 20H4V16L14 6M18 10L14 6"
            stroke="#000000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        class="square-btn icon-btn delete-btn"
        onclick="onDeleteStudentClick(${student.id})"
      >
        <svg
          fill="#000000"
          width="800px"
          height="800px"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z"
            fill-rule="evenodd"
          />
        </svg>
      </button>
    </div>`;
    row.appendChild(optionsCell);

    studentsTableBody.appendChild(row);
  });

  document.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
    checkbox.checked = false;
  });

  resizeParent();
}

function onGeneralCheckboxChange() {
  const generalCheckbox = document.getElementById("general-checkbox");

  document.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
    if (checkbox.id === generalCheckbox.id) return;

    checkbox.checked = generalCheckbox.checked;
  });
}

function onStudentCheckboxChange() {
  const generalCheckbox = document.getElementById("general-checkbox");

  if (
    Array.from(document.querySelectorAll("input[type=checkbox]")).every(
      (checkbox) => checkbox.checked || checkbox.id === generalCheckbox.id
    )
  ) {
    document.getElementById("general-checkbox").checked = true;
  } else {
    document.getElementById("general-checkbox").checked = false;
  }
}

function onAddStudentClick() {
  parentDoc.getElementById("student-form").classList.remove("invisible");
  parentDoc.getElementById("background-blurer").classList.remove("invisible");
  parentDoc.getElementById("student-form").reset();

  formState = "add";
  parentDoc.getElementById("student-form-title").textContent = "Add student";
  parentDoc.getElementById("submit-form-btn").textContent = "Create";

  edittedStudentId = null;
}

async function onEditStudentClick(studentId) {
  parentDoc.getElementById("student-form").classList.remove("invisible");
  parentDoc.getElementById("background-blurer").classList.remove("invisible");
  parentDoc.getElementById("student-form").reset();

  formState = "edit";
  parentDoc.getElementById("student-form-title").textContent = "Edit student";
  parentDoc.getElementById("submit-form-btn").textContent = "Save";

  edittedStudentId = studentId;
  const data = await apiRequest(`/api/students/${studentId}`, "GET");
  const student = data.student;

  const groupSelect = parentDoc.getElementById("group");
  groupSelect.value = student.group;
  if (groupSelect.value) {
    groupSelect.classList.remove("disabled-selected");
  }
  parentDoc.getElementById("first-name").value = student.firstName;
  parentDoc.getElementById("last-name").value = student.lastName;
  const genderSelect = parentDoc.getElementById("gender");
  genderSelect.value = student.gender;
  if (genderSelect.value) {
    genderSelect.classList.remove("disabled-selected");
  }
  const birthdayInput = parentDoc.getElementById("birthday");
  birthdayInput.value = student.birthday;
  if (birthdayInput.value) {
    birthdayInput.classList.add("filled-field");
  }
}

async function onDeleteStudentClick(studentId) {
  try {
    const data = await apiRequest(`/api/students/${studentId}`, "GET");
    const studentToDelete = data.student;

    studentsIdsToDelete = [studentId];
    isMultipleDelete = false;

    window.parent.showDeleteModal(
      `${studentToDelete.firstName} ${studentToDelete.lastName}`
    );
  } catch (error) {
    window.parent.showErrorModal(error);
    return;
  }
}

function onDeleteAllStudentsClick() {
  const generalCheckbox = document.getElementById("general-checkbox");

  studentsIdsToDelete = Array.from(
    document.querySelectorAll("input[type=checkbox]")
  )
    .filter(
      (checkbox) => checkbox.checked && checkbox.id !== generalCheckbox.id
    )
    .map((checkbox) => +checkbox.dataset.id);

  if (studentsIdsToDelete.length === 0) return;
  isMultipleDelete = true;

  window.parent.showDeleteModal(null);
}

async function submitStudentForm(event) {
  event.preventDefault();

  const groupSelect = parentDoc.getElementById("group");
  const firstNameInput = parentDoc.getElementById("first-name");
  const lastNameInput = parentDoc.getElementById("last-name");
  const genderSelect = parentDoc.getElementById("gender");
  const birthdayInput = parentDoc.getElementById("birthday");

  const studentData = JSON.stringify({
    group: groupSelect.value,
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    gender: genderSelect.value,
    birthday: birthdayInput.value,
  });

  if (formState === "add") {
    try {
      await apiRequest("/api/students", "POST", studentData);
    } catch (error) {
      window.parent.showErrorModal(error);
      return;
    }
  } else {
    try {
      await apiRequest(`/api/students/${edittedStudentId}`, "PUT", studentData);
    } catch (error) {
      window.parent.showErrorModal(error);
      return;
    }
  }

  parentDoc.getElementById("student-form").classList.add("invisible");
  parentDoc.getElementById("background-blurer").classList.add("invisible");

  await refillStudentsTable();
}

async function onDeleteModalApprove(event) {
  event.preventDefault();

  parentDoc.getElementById("delete-modal").classList.add("invisible");
  parentDoc.getElementById("background-blurer").classList.add("invisible");

  try {
    if (isMultipleDelete) {
      const idsData = JSON.stringify({ ids: studentsIdsToDelete });
      await apiRequest("/api/students", "DELETE", idsData);
    } else {
      await apiRequest(`/api/students/${studentsIdsToDelete[0]}`, "DELETE");
    }
  } catch (error) {
    window.parent.showErrorModal(error);
    return;
  }

  await refillStudentsTable();
}

function onDeleteModalCancel() {
  parentDoc.getElementById("delete-modal").classList.add("invisible");
  parentDoc.getElementById("background-blurer").classList.add("invisible");
  isMultipleDelete = false;
  prefilteredStudents = students;
}

parentDoc
  .getElementById("submit-form-btn")
  .addEventListener("click", submitStudentForm);

parentDoc
  .getElementById("approve-delete-btn")
  .addEventListener("click", onDeleteModalApprove);

parentDoc
  .getElementById("cancel-delete-btn")
  .addEventListener("click", onDeleteModalCancel);

parentDoc
  .getElementById("delete-modal-close-btn")
  .addEventListener("click", onDeleteModalCancel);

refillStudentsTable();
