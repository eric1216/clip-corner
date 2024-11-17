export const isInputOfLengthThree = (input: string) => {
  const trimmedLength = input.trim().length;
  return trimmedLength >= 3 && trimmedLength <= 15;
};

export const isPasswordStrong = (input: string) => {
  return /^(?=.*[A-Z])(?=.*\d).{3,}$/.test(input);
};

// export const isYoutubeLinkValid = (input: string) => {
//   const regex =
//   /(http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?)/
//   ;
//   const match = input.match(regex);
//   return match ? match[1] : null;
// };
