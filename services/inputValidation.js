export const isEmpty = (input) => {
  return input === '';
};

export const isEmail = (input) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input);
};

export const isMatch = (input1, input2) => {
  return input1 === input2;
};
