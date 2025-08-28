export const isValidEmail = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(email);
};

export const isSingleDigitorEmptyString = (text: string): boolean => {
  return /^\d?$/.test(text);
};
