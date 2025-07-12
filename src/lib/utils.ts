/***************************************************************
                     Validation
***************************************************************/
export const isEmptyString = (value: string) => {
  return !value || value.trim() === '';
}
