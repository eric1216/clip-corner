export const isInputOfLengthThree = (input: string) => {
  return input.trim().length > 2;
};

export const isPasswordStrong = (input: string) => {
  return /^(?=.*[A-Z])(?=.*\d).{3,}$/.test(input);
};
