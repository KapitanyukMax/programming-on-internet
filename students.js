let formState = "add";
let edittedStudentId = null;
const idGeneratorStr = localStorage.getItem("idGenerator");
let idGenerator = idGeneratorStr ? +idGeneratorStr : 0;
const studentsStr = localStorage.getItem("students");
let students = studentsStr ? JSON.parse(studentsStr) : [];
let prefilteredStudents = students;
let predeletedStudents = [];
let isMultipleDelete = false;

const parentDoc = window.parent.document;

function resizeParent() {
  if (window.parent && window.parent.adjustIframeHeight) {
    window.parent.adjustIframeHeight();
  }
}

function refillStudentsTable() {
  localStorage.setItem("students", JSON.stringify(students));
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

function onEditStudentClick(studentId) {
  parentDoc.getElementById("student-form").classList.remove("invisible");
  parentDoc.getElementById("background-blurer").classList.remove("invisible");
  parentDoc.getElementById("student-form").reset();

  formState = "edit";
  parentDoc.getElementById("student-form-title").textContent = "Edit student";
  parentDoc.getElementById("submit-form-btn").textContent = "Save";

  edittedStudentId = studentId;
  const student = students.find((student) => student.id === studentId);

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

function onDeleteStudentClick(studentId) {
  prefilteredStudents = students.filter(function (student) {
    if (student.id === studentId) {
      predeletedStudents = [student];
      return false;
    }
    return true;
  });
  isMultipleDelete = false;

  window.parent.showDeleteModal(
    `${predeletedStudents[0].firstName} ${predeletedStudents[0].lastName}`
  );
}

function onDeleteAllStudentsClick() {
  const generalCheckbox = document.getElementById("general-checkbox");

  const selectedIds = Array.from(
    document.querySelectorAll("input[type=checkbox]")
  )
    .filter(
      (checkbox) => checkbox.checked && checkbox.id !== generalCheckbox.id
    )
    .map((checkbox) => +checkbox.dataset.id);

  if (selectedIds.length === 0) return;

  predeletedStudents = [];
  prefilteredStudents = [];
  students.forEach(function (student) {
    if (selectedIds.includes(student.id)) {
      predeletedStudents.push(student);
    } else {
      prefilteredStudents.push(student);
    }
  });

  isMultipleDelete = true;

  window.parent.showDeleteModal(null);
}

function submitStudentForm(event) {
  event.preventDefault();

  const nameRegex = window.parent.getNameRegex();

  const groupSelect = parentDoc.getElementById("group");
  const firstNameInput = parentDoc.getElementById("first-name");
  const lastNameInput = parentDoc.getElementById("last-name");
  const genderSelect = parentDoc.getElementById("gender");
  const birthdayInput = parentDoc.getElementById("birthday");

  let valid = true;

  if (!groupSelect.value) {
    valid = false;
    groupSelect.classList.add("invalid-field");
    groupSelect.classList.remove("disabled-selected");
    parentDoc.getElementById("group-error").classList.remove("white-text");
    parentDoc.getElementById("group-error").classList.add("red-text");
  }

  if (
    !firstNameInput.value ||
    !nameRegex.test(firstNameInput.value) ||
    firstNameInput.value.length <= 2
  ) {
    valid = false;
    firstNameInput.classList.add("invalid-field");
    parentDoc.getElementById("first-name-error").classList.remove("white-text");
    parentDoc.getElementById("first-name-error").classList.add("red-text");
  }

  if (
    !lastNameInput.value ||
    !nameRegex.test(lastNameInput.value) ||
    lastNameInput.value.length <= 2
  ) {
    valid = false;
    lastNameInput.classList.add("invalid-field");
    parentDoc.getElementById("last-name-error").classList.remove("white-text");
    parentDoc.getElementById("last-name-error").classList.add("red-text");
  }

  if (!genderSelect.value) {
    valid = false;
    genderSelect.classList.add("invalid-field");
    genderSelect.classList.remove("disabled-selected");
    parentDoc.getElementById("gender-error").classList.remove("white-text");
    parentDoc.getElementById("gender-error").classList.add("red-text");
  }

  if (!birthdayInput.value) {
    valid = false;
    birthdayInput.classList.add("invalid-field");
    birthdayInput.classList.remove("filled-field");
    parentDoc.getElementById("birthday-error").classList.remove("white-text");
    parentDoc.getElementById("birthday-error").classList.add("red-text");
    parentDoc.getElementById("birthday-error").textContent =
      "Enter a birthday please";
  } else if (!window.parent.isAgeInRange(birthdayInput.value, 13, 100)) {
    valid = false;
    birthdayInput.classList.add("invalid-field");
    birthdayInput.classList.remove("filled-field");
    parentDoc.getElementById("birthday-error").classList.remove("white-text");
    parentDoc.getElementById("birthday-error").classList.add("red-text");
    parentDoc.getElementById("birthday-error").textContent = "Invalid age";
  }

  if (!valid) return;

  parentDoc.getElementById("student-form").classList.add("invisible");
  parentDoc.getElementById("background-blurer").classList.add("invisible");

  let id;

  if (formState === "add") {
    idGenerator++;
    localStorage.setItem("idGenerator", idGenerator);
    id = idGenerator;
    students.push({
      id,
      group: groupSelect.value,
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      gender: genderSelect.value,
      birthday: birthdayInput.value,
    });
  } else {
    const studentIndex = students.findIndex(
      (student) => student.id === edittedStudentId
    );

    id = edittedStudentId;

    students[studentIndex] = {
      id,
      group: groupSelect.value,
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      gender: genderSelect.value,
      birthday: birthdayInput.value,
    };
  }

  const reqStr =
    `${formState}: ${id}|${groupSelect.value}|${firstNameInput.value}|` +
    `${lastNameInput.value}|${genderSelect.value}|${birthdayInput.value}`;
  console.log(reqStr);

  refillStudentsTable();
}

function onDeleteModalApprove(event) {
  event.preventDefault();

  let reqStr = `delete:\n`;
  for (let i = 0; i < predeletedStudents.length; i++) {
    reqStr +=
      `[${i}] - ${predeletedStudents[i].id}|${predeletedStudents[i].group}|${predeletedStudents[i].firstName}|` +
      `${predeletedStudents[i].lastName}|${predeletedStudents[i].gender}|${predeletedStudents[i].birthday}\n`;
  }
  console.log(reqStr);

  parentDoc.getElementById("delete-modal").classList.add("invisible");
  parentDoc.getElementById("background-blurer").classList.add("invisible");
  isMultipleDelete = false;
  students = prefilteredStudents;
  predeletedStudents = [];

  refillStudentsTable();
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
