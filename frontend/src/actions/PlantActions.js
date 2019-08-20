import {
	FETCH_PLANTS,
	NEW_PLANT,
	DELETE_PLANT,
	SELECT_PLANT
} from "./types";

//actions are functions, exported

export const fetchPlants = () => dispatch => {
	//=> dispatch => returns a func that takes args(dispatch)
	//dispatch makes async requests
	//think of as a resolver in promises
	fetch("/api/plants/")
		.then(res => res.json())
		//dispatch data (plants) to reducer
		.then(data => dispatch({
			type: FETCH_PLANTS,
			payload: data.data
		})
	);
}

export const createPlant = (plant_name, token) => dispatch => {
	//request api to create a new plant
	fetch("/api/plants/", {
		method: "POST",
		headers: {
			'Content-Type': "application/json",
			'Auth-Token': token
		},
		body: JSON.stringify({ plant_name: plant_name })
	})
		.then(res => res.json())
		.then(data => {
			console.log(data)
			//get new plant from the api and insert it into plants
			fetch("/api/plants/"+data.data._id)
				.then(res => res.json())
				.then(plant => dispatch({
					type: NEW_PLANT,
					payload: plant.data
				}));			
		})
}

export const deletePlant = (id, token) => dispatch => {
	fetch("/api/plants/"+id, {
		method: "DELETE",
		headers: {
			'Content-Type': "application/json",
			'Auth-Token': token
		}
	})
	.then(res => res.json())
	.then(data => dispatch({
		type: DELETE_PLANT,
		payload: id
	}))
}


export const selectPlant = (id) => dispatch => {
	dispatch({
		type: SELECT_PLANT,
		payload: id
	})
}



