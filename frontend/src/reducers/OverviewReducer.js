import { FETCH_ALL_PLANTS_AND_GARDENS } from "../actions/types";

const initialState = {
  objects: [],
  loaded: false
};

function sortPlantsAndGardens(payload){
  // 2 plants, 1 garden, 2 plants, 1 garden, 1 garden...
  let l_plants = payload.filter(item => item.type == "plant");
  let l_gardens = payload.filter(item => item.type == "garden");
  let sorted = [];
  while((l_plants.length + l_gardens.length) > 0) {
    if (l_plants.length >= 2) {
      for (var i=0; i<2; i++) {
        sorted.push(l_plants[0]);
        l_plants.shift()
      }
    }
    if (l_gardens.length > 0) {    
      sorted.push(l_gardens[0]);
      l_gardens.shift();
    } else { //all gardens inserted
      l_plants.forEach(plant => sorted.push(plant))
      l_plants = [];
    }
  }

  return sorted;
}

export default function(state=initialState, action) {
	switch(action.type) {
    case FETCH_ALL_PLANTS_AND_GARDENS:
      return {
      	...state,
        objects: action.payload,
        loaded: true
      	// objects: sortPlantsAndGardens(action.payload)
      };
    default:
      return state;
	}
}

