import validate from "validate.js";

export const validateString = (id, value) => {
  const constraints = {
    presence: { allowEmpty: false },
  };
  if (value !== "") {
    constraints.format = {
      pattern: "^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$",
      flags: "i",
      message: "value can only contain letters",
    };
  }
  const validationResult = validate({ [id]: value }, { [id]: constraints });
  return validationResult && validationResult[id][0];
};

export const validateClubNameAndCity = (id, value) => {
  const constraints = {
    presence: { allowEmpty: false },
  };
  if (value !== "") {
    constraints.format = {
      pattern: "^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$",
      flags: "i",
      message: "value can only contain letters",
    };
  }
  const validationResult = validate({ [id]: value }, { [id]: constraints });
  return validationResult && validationResult[id][0];
}

export const validateEmail = (id, value) => {
    const constraints = {
      presence: { allowEmpty: false },
    };
    if (value !== "") {
      constraints.email = {
            message: "Invalid email",
      };
    }
    const validationResult = validate({ [id]: value }, { [id]: constraints });
    return validationResult && validationResult[id][0];
};

export const validatePassword = (id, value) => {
    const constraints = {
      length: {
        minimum: 6,
        message: "must be at least 6 characters",
      }
    };
    const validationResult = validate({ [id]: value }, { [id]: constraints });
    return validationResult && validationResult[id][0];
};