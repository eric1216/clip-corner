export const isInputOfLengthThree = (input: string) => {
  const trimmedLength = input.trim().length;
  return trimmedLength >= 3 && trimmedLength <= 15;
};

export const isPasswordStrong = (input: string) => {
  return /^(?=.*[A-Z])(?=.*\d).{3,}$/.test(input);
};

export const isValidYouTubeURL = (input: string) => {
  return input.match(
    // eslint-disable-next-line no-useless-escape
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
};
