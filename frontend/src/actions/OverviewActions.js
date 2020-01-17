import { FETCH_ALL_PLANTS_AND_GARDENS } from "./types";

export const fetchAllPlantsAndGardens = () => dispatch => {
	fetch("/api/")
		.then(res => res.json())
		//dispatch data (plants) to reducer
		.then(data => dispatch({
			type: FETCH_ALL_PLANTS_AND_GARDENS,
			payload: data.data
		})
	);
}
