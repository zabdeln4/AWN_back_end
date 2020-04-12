const Validator = require("validator");
const isEmpty = require("./is-empty");

exports.validateRegisterUserInput = function(data) {
  let errors = {};
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.userName = !isEmpty(data.userName) ? data.userName : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters.";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "passwords must match";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field is required";
  }
  if (!Validator.isLength(data.userName, { min: 2, max: 30 })) {
    errors.password = "User Name field must be at least 2 characters.";
  }
  if (Validator.isEmpty(data.userName)) {
    errors.userName = "User Name field is required";
  }
  if (Validator.isEmpty(data.phone)) {
    errors.phone = "Phone field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
exports.validateRegisterAdminInput = function(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.adminName = !isEmpty(data.adminName) ? data.adminName : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters.";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (Validator.isEmpty(data.adminName)) {
    errors.adminName = "User Name field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
