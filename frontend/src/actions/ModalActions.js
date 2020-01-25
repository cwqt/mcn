import toaster from "toasted-notes";
import { ModalConsts } from "./types";

export const setCurrentModal = (modal, authRequired) => (dispatch, getStore) => {
	if(authRequired && !getStore().auth.isAuthorised) {
	  toaster.notify("You're not authorised to perform this action", {
	    duration: 1000,
	    position: "top-right"
	  })
	  return;
	}

	dispatch({
			type: ModalConsts.SET_CURRENT_MODAL,
			payload: modal,
	})
	dispatch({
			type: ModalConsts.SET_MODAL_VISIBILITY,
			payload: true,
	})
}

export const setModalWrapperState = state => dispatch => {
	dispatch({
		type: ModalConsts.SET_MODAL_WRAPPER_STATE,
		payload: state
	})
} 

export const setModalVisibility = status => dispatch => {
	dispatch({
			type: ModalConsts.SET_MODAL_VISIBILITY,
			payload: status,
	})	
}

