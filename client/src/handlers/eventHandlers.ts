import { AnyAction, Dispatch } from "@reduxjs/toolkit";

const listenForEnter = (
  e: React.KeyboardEvent<HTMLInputElement>,
  userNameChange: string,
  dispatch: Dispatch<AnyAction>,
  userNameSet: (userName: string) => AnyAction
) => {
  if (e.key === "Enter" && userNameChange) {
    dispatch(userNameSet(userNameChange));
  }
};

const handleNameClick = (
  userNameChange: string,
  dispatch: Dispatch<AnyAction>,
  userNameSet: (userName: string) => AnyAction
) => {
  if (userNameChange) {
    dispatch(userNameSet(userNameChange));
  }
};

const nameInputFocus = (inputElement: HTMLInputElement) => {
  if (inputElement) {
    inputElement.focus();
  }
};

export { listenForEnter, handleNameClick, nameInputFocus };
