export const generateGameId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};