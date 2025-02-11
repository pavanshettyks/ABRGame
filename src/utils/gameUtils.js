export const generateGameId = () => {
  // return Math.random().toString(36).substring(2, 7).toUpperCase();
  return Math.floor(10000 + Math.random() * 90000);
};