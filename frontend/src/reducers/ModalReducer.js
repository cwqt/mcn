import { ModalConsts } from "../actions/types";

const initialState = {
	currentModal: "",
  isVisible: false,
  currentState: ""
};

export default function(state=initialState, action) {
	switch(action.type) {
    case ModalConsts.SET_CURRENT_MODAL:
      return {
      	...state,
      	currentModal: action.payload,
        currentState: ""
      };
    case ModalConsts.SET_MODAL_VISIBILITY:
      return {
        ...state,
        isVisible: action.payload,
        currentState: ""
      }
    case ModalConsts.SET_MODAL_WRAPPER_STATE:
      return {
        ...state,
        currentState: action.payload
      }
    default:
      return state;
	}
}

