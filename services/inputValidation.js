export const isEmpty = (input) => {
  return input == '';
};

export const isEmail = (input) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input);
};

export const isMatch = (input1, input2) => {
  return input1 === input2;
};

export const validateLogin = (email, password) => {
  if (isEmpty(email) || isEmpty(password)) {
    return false;
  }
  if (!isEmail(email)) {
    return false;
  }
  return true;
};

export const validateRegistration = (
  name,
  email,
  password,
  confirmPassword
) => {
  if (
    isEmpty(name) ||
    isEmpty(email) ||
    isEmpty(password) ||
    isEmpty(confirmPassword)
  ) {
    return false;
  }
  if (!isEmail(email)) {
    return false;
  }
  if (!isMatch(password, confirmPassword)) {
    return false;
  }
  return true;
};
