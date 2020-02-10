import { PageConsts } from "./types";

export const getSelf = _id => (dispatch, getState) => {
	dispatch({
		type: PageConsts.GET_SELF_LOADING,
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
			type: PageConsts.GET_SELF_FAILURE,
			payload: {
				message:"Could not find item in store"
			}
		})
	}

	if(foundObject) {
		dispatch({
			type: PageConsts.GET_SELF_SUCCESS,
			payload: {
				data: foundObject,
			}
		})
		dispatch(getMeasurements(_id, foundObject.type))
	}
}

export const getMeasurements = (_id, type) => (dispatch, getState) => {
	dispatch({
		type: PageConsts.GET_MEASUREMENTS_LOADING,
	})

	fetch(`/api/${type}s/${_id}/measurements?last=100`)
		.then(res => res.json())
		.then(data => {
			if(!data.data) {
				dispatch({
					type: PageConsts.GET_MEASUREMENTS_FAILURE
				})
			}

			var sorted = {};
			//use most recent measurement to show what graphs we should show
			Object.keys(data.data[0].measurements).forEach(key => sorted[key] = {})

			// map onto sorted
			data.data.forEach(doc => {
				for(const [m_type, value] of Object.entries(doc.measurements)) {
					if(m_type in Object.keys(sorted) == true) {
						sorted[m_type][doc.timestamp] = value;
					}
				}
			})

			dispatch({
				type: PageConsts.GET_MEASUREMENTS_SUCCESS,
				payload: {
					data: sorted					
				}
			})
		})
}
