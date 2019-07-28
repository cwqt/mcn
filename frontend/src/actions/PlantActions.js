import { FETCH_PLANTS, NEW_PLANT } from "./types";

//actions are functions, exported

export const fetchPlants = () => dispatch => {
	//=> dispatch => returns a func that takes args(dispatch)
	//dispatch makes async requests
	//think of as a resolver in promises
	fetch("/plants/")
		.then(res => res.json())
		//dispatch data (plants) to reducer
		.then(data => dispatch({
			type: FETCH_PLANTS,
			payload: data.message
		})
	);
}