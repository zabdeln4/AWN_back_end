const Validator = require("validator");
const isEmpty = require("./is-empty");

exports.validateLoginUserInput = function(data) {
  let errors = {};
  let logindata;
  data.password = !isEmpty(data.password) ? data.password : "";

  data.email = !isEmpty(data.email) ? data.email : "";
  data.userName = !isEmpty(data.userName) ? data.userName : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";

  if (Validator.isEmpty(data.email) && Validator.isEmpty(data.userName) && Validator.isEmpty(data.phone)) {
    errors.email = "Email or User Name or Phone number is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.isEmpty(data.email) && !Validator.isEmpty(data.password)) {
    logindata = {
      email: data.email,
      password: data.password
    };
  } else if (!Validator.isEmpty(data.userName) && !Validator.isEmpty(data.password)) {
    logindata = {
      userName: data.userName,
      password: data.password
    };
  } else if (!Validator.isEmpty(data.phone) && !Validator.isEmpty(data.password)) {
    logindata = {
      phone: data.phone,
      password: data.password
    };
  }

  return {
    logindata,
    errors,
    isValid: isEmpty(errors)
  };
};

exports.validateLoginAdminInput = function(data) {
  let errors = {};
  let logindata;
  data.password = !isEmpty(data.password) ? data.password : "";

  data.email = !isEmpty(data.email) ? data.email : "";
  data.adminName = !isEmpty(data.adminName) ? data.adminName : "";

  if (Validator.isEmpty(data.email) && Validator.isEmpty(data.adminName)) {
    errors.email = "Email or Admin Name is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.isEmpty(data.email) && !Validator.isEmpty(data.password)) {
    logindata = {
      email: data.email,
      password: data.password
    };
  } else if (!Validator.isEmpty(data.adminName) && !Validator.isEmpty(data.password)) {
    logindata = {
      adminName: data.adminName,
      password: data.password
    };
  }

  return {
    logindata,
    errors,
    isValid: isEmpty(errors)
  };
};
