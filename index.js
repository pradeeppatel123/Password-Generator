const inputSLider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowecaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '`~!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle color to grey
setIndicator("#ccc");
// set passwordLength
function handleSlider() {
  inputSLider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  // yha kushh aur likha hai
  const min = inputSLider.min;
  const max = inputSLider.max;
  inputSLider.style.backgroundSize =
    ((passwordLength - min) * 100/ (max - min)) + "% 100%";
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  // shadow
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function generateNumber() {
  return getRndInteger(0, 9);
}
function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}
function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}
function generateSymbol() {
  const rndNum = getRndInteger(0, symbols.length);
  return symbols.charAt(rndNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowecaseCheck.checked) hasUpper = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  // copy wala span visible
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}
// suffle password function
function sufflePassword(array) {
  // Fisher Yates Algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });
  // special case
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSLider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});
copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

generateBtn.addEventListener("click", () => {
  // None of the checkbox are selected
  if (checkCount == 0) {
    return;
  }
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
  // lets start the jurney to find the new password
  console.log("starting the junery");
  //Remove the old password
  password = "";

  // let's put the stuff mentioned by checkboxes

  let funcArr = [];

  if (uppercaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }
  if (lowecaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }
  if (numbersCheck.checked) {
    funcArr.push(generateNumber);
  }
  if (symbolsCheck.checked) {
    funcArr.push(generateSymbol);
  }

  // Compulosory additions

  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  console.log("Compulosory  done");
  // Remaining additions

  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let rndIndex = getRndInteger(0, funcArr.length);
    console.log("RndIndex: " + rndIndex);
    password += funcArr[rndIndex]();
  }
  console.log("Remaining additions done");
  // Suffle the password
  password = sufflePassword(Array.from(password));
  console.log("suffle done");
  // show in UI

  passwordDisplay.value = password;
  console.log("UI addition done");
  // calculate strength

  calcStrength();
});
