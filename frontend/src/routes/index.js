import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
//connects component to redux provider store
import { connect } from "react-redux";
import { fetchAllPlantsAndGardens } from "../actions/OverviewActions";

import OverviewItem from "../components/OverviewComponents/Item"
import Welcomer from "../components/OverviewComponents/Welcomer"

const OverviewContainer = styled.div`
	display: flex;
  flex-flow: row wrap;
  justify-content: start;
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
    	<OverviewContainer>
    		{this.props.objects.length === 0 && !this.props.isFetching &&
    			<p>No gardens or plants found</p>
    		}
    		<Welcomer />
    		{this.props.objects.map((object, idx) => {
    			return <OverviewItem key={idx} {...object} />
    		})}
    	</OverviewContainer>
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
