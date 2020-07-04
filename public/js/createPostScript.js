const formValue = document.getElementById("form");
const titleValue = document.getElementById("title");
const descriptionValue = document.getElementById("description");
const locationValue = document.getElementById("location");
const priceValue = document.getElementById("price");
const categoryValue = document.getElementById("category");
const imageUrlValue = document.getElementById("imageUrl");
const submitButton = document.getElementById("submit-btn");
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
    showError(input, `${getFieldName(input)} is too short. Let us know more.`);
    return false;
  } else if (input.value.length > max) {
    showError(input, `${getFieldName(input)} is too long. Please be brief.`);
    return false;
  } else {
    showSuccess(input);
    return true;
  }
}

// Get fieldname
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// Event listeners
submitButton.addEventListener("click", submitForm);
const geo = navigator.geolocation;
geo.getCurrentPosition(
  (loc) => {
    console.log(loc);
  },
  (err) => console.log(err)
);
function submitForm(e) {
  e.preventDefault();
  val = checkRequired([
    titleValue,
    categoryValue,
    priceValue,
    descriptionValue,
    locationValue,
    imageUrlValue,
  ]);
  val = checkLength(titleValue, 5, 120) && val;
  val = checkLength(descriptionValue, 20, 5000) && val;
  if (val) {
    form.submit();
  }
  /* 
  titleValue.value = "One Plus x";
  categoryValue.value = "Cell Phones";
  priceValue.value = 100;
  descriptionValue.value = "3 years old good condition.";
  locationValue.value = "Sardar Nagar, Moga.";
  imageUrlValue.value =
    "https://img.gkbcdn.com/p/2015-11-10/oneplus-x-standard-5-0inch-fhd-1920-1080-4g-lte-android-5-1-3gb-16gb-smartphone-snapdragon-801-quad-core-13-0mp-camera---white-1571987892427._w500_.jpg"; 
  form.submit();*/
}
