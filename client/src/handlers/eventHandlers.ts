import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { newGameSet } from "../store/slices/gameBoardSlice";

const listenForEnter = (
  e: React.KeyboardEvent<HTMLInputElement>,
  userNameChange: string,
  dispatch: Dispatch<AnyAction>,
  userNameSet: (userName: string) => AnyAction,
) => {
  if (e.key === "Enter" && userNameChange) {
    dispatch(newGameSet(false));
    dispatch(userNameSet(userNameChange));
  }
};

const handleNameClick = (
  userNameChange: string,
  dispatch: Dispatch<AnyAction>,
  userNameSet: (userName: string) => AnyAction,
) => {
  if (userNameChange) {
    dispatch(newGameSet(false));
    dispatch(userNameSet(userNameChange));
  }
};

const nameInputFocus = (inputElement: HTMLInputElement) => {
  if (inputElement) {
    inputElement.focus();
  }
};

export { listenForEnter, handleNameClick, nameInputFocus };
