import React from 'react';
import PropTypes from "prop-types";
//connects component to redux provider store
import { connect } from "react-redux";
import { fetchPlants } from "../actions/PlantActions.js";
import Plant from "./Plant";

class Plants extends React.Component { 
	componentDidMount() {
		//call the action
		//fetch api
		//dispatch type+payload to reducer
		this.props.fetchPlants()
		//reducer returns new state to store
		//map state to props
	}

  render() {
    return (
    	<div>
		  	{this.props.plants.map(plant => (
		  		<div key={plant._id}>
			  		<Plant
			  			_id={plant._id}
			  			plant_name={plant.plant_name}
			  			moisture_levels={plant.updates}
			  			image_url={plant.image_url}
			  		/>
			  		<hr />
		  		</div>
		  	))}
    	</div>
    );
  }
}

Plants.propTypes = {
	fetchPlants: PropTypes.func.isRequired,
	plants: PropTypes.array.isRequired
}

const MapStateToProps = state => ({
	//root reducer returns plants
	//PlantReducer has state with items
	plants: state.plants.items
	//now have this.props.plants
})

//map state to props
export default connect(MapStateToProps, { fetchPlants })(Plants);
