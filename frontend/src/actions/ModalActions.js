import { ModalConsts } from "./types";

export const setCurrentModal = modal => dispatch => {
	dispatch({
			type: ModalConsts.SET_CURRENT_MODAL,
			payload: modal,
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

