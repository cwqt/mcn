import { FETCH_PLANTS, NEW_PLANT, DELETE_PLANT } from "./types";

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
			payload: data.data
		})
	);
}

export const createPlant = plant_name => dispatch => {
	//request api to create a new plant
	fetch("/plants/", {
		method: "POST",
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({ plant_name: plant_name })
	})
		.then(res => res.json())
		.then(data => {
			//get new plant from the api and insert it into plants
			fetch("/plants/"+data.message._id)
				.then(res => res.json())
				.then(plant => dispatch({
					type: NEW_PLANT,
					payload: plant.data
				}));			
		})
}

export const deletePlant = plant_id => dispatch => {
	fetch("/plants/"+plant_id, {
		method: "DELETE"
	})
	.then(res => res.json())
	.then(data => dispatch({
		type: DELETE_PLANT,
		payload: {"_id": plant_id}
	}))
}
