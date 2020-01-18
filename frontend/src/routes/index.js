import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
//connects component to redux provider store
import { connect } from "react-redux";
import { fetchAllPlantsAndGardens } from "../actions/OverviewActions";

import Garden from "../components/OverviewComponents/Garden";
import Plant from "../components/OverviewComponents/Plant";
import Page from "../components/Page";

const OverviewContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
`

class Overview extends React.Component { 
	componentDidMount() {
		//call the action
		//fetch api
		//dispatch type+payload to reducer
		if (this.props.objects.length == 0) {
			this.props.fetchAllPlantsAndGardens()			
		}
		//reducer returns new state to store
		//map state to props
	}

  render() {
    return (
    	<Page title="Overview">
    		{this.props.isFetching &&
    			<p>Fetching data from API...</p>
    		}
    		{this.props.objects.length === 0 && !this.props.isFetching &&
    			<p>No gardens or plants found</p>
    		}
    		{this.props.objects.map((object, idx) => {
    			if (object.type === "garden") { return <Garden key={idx} {...object}/> } 
    			if (object.type === "plant")  { return <Plant key={idx} {...object}/>  } 
    		})}
    	</Page>
    );
  }
}

Overview.propTypes = {
	fetchAllPlantsAndGardens: PropTypes.func.isRequired,
}

const MapStateToProps = store => ({
	//root reducer returns objects
	//PlantReducer has state with items
	objects: store.overview.objects,
	isFetching: store.overview.isFetching
	//now have this.props.objects
})

//map state to props
export default connect(MapStateToProps, { fetchAllPlantsAndGardens })(Overview);
