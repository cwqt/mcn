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
    	<div className="plants">
    		<h1> Plants </h1>
		  	{this.props.plants.map(plant => (
		  		<Plant _id={plant._id.$oid} plant_name={plant.plant_name} />
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
