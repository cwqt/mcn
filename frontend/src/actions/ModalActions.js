import { SET_CURRENT_MODAL, SET_MODAL_VISIBILITY } from "./types";

export const setCurrentModal = modal => dispatch => {
	dispatch({
			type: SET_CURRENT_MODAL,
			payload: modal,
	})	
}

export const setModalVisibility = status => dispatch => {
	dispatch({
			type: SET_MODAL_VISIBILITY,
			payload: status,
	})	
}

