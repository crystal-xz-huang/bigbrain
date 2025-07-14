/***************************************************************
                     Validation
***************************************************************/
export const isEmptyString = (value: string) => {
  return !value || value.trim() === '';
}

export const uid = () => {
  const num = Math.floor(Math.random() * 1000000);
  // return as a 10 digit number
  return num.toString().padStart(10, '0');
}
