// import { SET_CURRENT_MODAL, SET_MODAL_VISIBILITY } from "./types";

export const getAllPlantsAndGardens = () => dispatch => {
	dispatch({
			type: "GET_ALL_PLANTS_AND_GARDENS",
			payload: modal,
	})	
}
