export default function dataValidate(input) {
  let error = {};
  const namePattern = /^[A-Za-z]+$/;
  let today = new Date();
  let ageVerify = new Date(today.setFullYear(today.getFullYear() - 10));

  if (input.fname === "") {
    error.fname = "Please enter your first name";
  } else if (!namePattern.test(input.fname)) {
    error.fname = "Please enter a valid name";
  } else {
    error.fname = "";
  }

  if (input.lname === "") {
    error.lname = "Please enter your last name";
  } else if (!namePattern.test(input.lname)) {
    error.lname = "Please enter a valid name";
  } else {
    error.lnamename = "";
  }
  if (input.dob === "") {
    error.dob = "Please enter your date of birth";
  } else if (new Date(input.dob) >= ageVerify) {
    error.dob = "Student must be above the age of 10";
  } else {
    error.dob = "";
  }
  return error;
}
