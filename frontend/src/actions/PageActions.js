import { PageConsts } from "./types";

export const getSelf = _id => (dispatch, getState) => {
	dispatch({
		type: PageConsts.GET_SELF,
		payload: { status:"loading" }
	})

	let currentState = getState()
	let objects = currentState.overview.objects

	let foundObject = false;
	objects.forEach(object => {
		if(object._id === _id) {
			foundObject = object;
			return;
		}
	})

	if(!foundObject) {
		dispatch({
			type: PageConsts.GET_SELF,
			payload: {
				status: "failure",
				message:"Could not find item in store"
			}
		})
	}

	if(foundObject) {
		dispatch({
			type: PageConsts.GET_SELF,
			payload: {
				data: foundObject,
				status: "success",
			}
		})
	}
}
