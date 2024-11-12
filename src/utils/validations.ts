export const isInputOfLengthThree = (input: string) => {
  const trimmedLength = input.trim().length;
  return trimmedLength >= 3 && trimmedLength <= 15;
};

export const isPasswordStrong = (input: string) => {
  return /^(?=.*[A-Z])(?=.*\d).{3,}$/.test(input);
};
