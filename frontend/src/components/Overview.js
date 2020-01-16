import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
//connects component to redux provider store
import { connect } from "react-redux";
import { fetchPlants } from "../actions/PlantActions.js";

import Garden from "./Garden";
import Plant from "./Plant";

const Loader = styled.p`
	color: white;
	text-align: center;
	padding: 20px;
`

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
		  	<h1>Overview</h1>
		  	<hr />



    		{this.props.plants.length === 0 &&
    			<Loader>Probably spinning up Heroku API...</Loader>
    		}
		  	{this.props.plants.map(plant => (
		  		<div key={plant._id}>
			  		<Plant
			  			_id={plant._id}
			  			plant_name={plant.plant_name}
			  			updates={plant.updates}
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

const MapStateToProps = store => ({
	//root reducer returns plants
	//PlantReducer has state with items
	plants: store.plants.items
	//now have this.props.plants
})

//map state to props
export default connect(MapStateToProps, { fetchPlants })(Plants);
