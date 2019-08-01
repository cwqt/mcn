import { SET_CURRENT_MODAL, SET_MODAL_VISIBILITY } from "../actions/types";

const initialState = {
	currentModal: "",
  isVisible: false
};

export default function(state=initialState, action) {
	switch(action.type) {
    case SET_CURRENT_MODAL:
      return {
      	...state,
      	currentModal: action.payload
      };
    case SET_MODAL_VISIBILITY:
      return {
        ...state,
        isVisible: action.payload
      }
    default:
      return state;
	}
}

