const h2 = document.querySelector("h2");
const form = document.getElementById("form");
console.log(h2);
h2.addEventListener("click",()=>{
    form.classList.toggle("show");
})
const username = document.getElementById("username");
const mobile = document.getElementById("mobile");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");
const sButton = document.getElementById("submit-btn");
// Show input error message
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = "form-control error";
  const small = formControl.querySelector("small");
  small.innerText = message;
}

// Show success outline
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}

// Check email is valid


// Check required fields
function checkRequired(inputArr) {
  let val = true;
  inputArr.forEach(function (input) {
    if (input.value.trim() === "") {
      showError(input, `${getFieldName(input)} is required`);
      val = val && false;
    } else {
      showSuccess(input);
      val = val && true;
    }
  });
  return val;
}

// Check input length
function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} must be at least ${min} characters`
    );
    return false;
  } else if (input.value.length > max) {
    showError(
      input,
      `${getFieldName(input)} must be less than ${max} characters`
    );
    return false;
  } else {
    showSuccess(input);
    return true;
  }
}

// Check passwords match
function checkPasswordsMatch(input1, input2) {
  if (input1.value !== input2.value) {
    showError(input2, "Passwords do not match");
    return false;
  }
  return true;
}

// Get fieldname
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}
function checkMobileNo(input) {
  const number = +input.value;
  if (Number.isInteger(number) && input.value.length == 10) {
    showSuccess(input);
    return true;
  }
  showError(input, "Not a valid mobile no.");

  return false;
}
// Event listeners
function submitForm(e) {
  e.preventDefault();
  let val = true;
  val = checkRequired([username,]) && val;
  val = checkMobileNo(mobile) && val;
  val = checkLength(username, 3, 15) && val;
  val = checkPasswordsMatch(password, password2) && val;
  if (val === true) {
    form.submit();
  }
}
sButton.addEventListener("click", submitForm);
