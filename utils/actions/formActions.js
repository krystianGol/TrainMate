import { validateString, validatePassword, validateEmail } from "../validationConstraints";

const textFields = ["firstName", "lastName", "clubName", "city"];

export const validateInput = (inputId, inputValue) => {
    if (textFields.includes(inputId)) {
        return validateString(inputId, inputValue);
      } 
      else if (inputId === 'email') {
        return validateEmail(inputId, inputValue)
      } 
      else if (inputId === 'password') {
        return validatePassword(inputId, inputValue)
      }
}