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

export const getInitials = (name: string) => {
  if (!name) return '';
  const names = name.split(' ');
  const initials = names.map((n) => n[0]).join('');
  return initials.toUpperCase();
};