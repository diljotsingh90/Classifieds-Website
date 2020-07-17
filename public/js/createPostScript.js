const formValue = document.getElementById("form");
const titleValue = document.getElementById("title");
const descriptionValue = document.getElementById("description");
const areaValue = document.getElementById("area");
const countrysel = document.getElementById("country-select");
const statesel = document.getElementById("state-select");
const citysel = document.getElementById("city-select");
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
function checkImagesLength(input, length) {
  if (input.files.length == 0) {
    showError(input, "Select atleast 1 image.");
    return false;
  }
  if (input.files.length > length) {
    showError(input, "Can upload atmost 3 images.");
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
/* const geo = navigator.geolocation;
geo.getCurrentPosition(
  (loc) => {
    console.log(loc);
  },
  (err) => console.log(err)
); */
function submitForm(e) {
  e.preventDefault();
  val = checkRequired([
    titleValue,
    categoryValue,
    priceValue,
    descriptionValue,
    citysel,
    statesel,
    countrysel,
    areaValue,
  ]);
  val = checkLength(titleValue, 5, 120) && val;
  val = checkLength(descriptionValue, 20, 5000) && val;
  val = checkImagesLength(imageUrlValue, 3) && val;
  if (val) {
    form.submit();
  }
  
}
const bearer =document.getElementById("citytoken").value.toString();
const getCountries = async () => {
  const result = await fetch(
    "https://www.universal-tutorial.com/api/countries",
    {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + bearer,
        "Content-Type": "application/json",
      },
    }
  );
  const countries = await result.json();
  countries.forEach((country) => {
    const option = document.createElement("option");
    option.innerHTML = country.country_name;
    option.setAttribute("value", country.country_name);
    countrysel.appendChild(option);
  });
};
const getStates = async (state) => {
  const result = await fetch(
    "https://www.universal-tutorial.com/api/states/" + state,
    {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + bearer,
        "Content-Type": "application/json",
      },
    }
  );
  const states = await result.json();
  states.forEach((state) => {
    const option = document.createElement("option");
    option.innerHTML = state.state_name;
    option.setAttribute("value", state.state_name);
    statesel.appendChild(option);
  });
};

window.onload = (event) => {
  getCountries();
};
const getCities = async (city) => {
  const result = await fetch(
    "https://www.universal-tutorial.com/api/cities/" + city,
    {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + bearer,
        "Content-Type": "application/json",
      },
    }
  );
  const cities = await result.json();
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.innerHTML = city.city_name;
    option.setAttribute("value", city.city_name);
    citysel.appendChild(option);
  });
};

window.onload = (event) => {
  getCountries();
};

countrysel.addEventListener("change", () => {
  statesel.innerHTML = `<option value="">Please Select State</option>`;
  citysel.innerHTML = `<option value="">Please Select City</option>`;
  getStates(countrysel.value);
});
statesel.addEventListener("change", () => {
  citysel.innerHTML = `<option value="">Please Select City</option>`;
  getCities(statesel.value);
});
