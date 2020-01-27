import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import { connect } from "react-redux";
import { fetchAllPlantsAndGardens } from "../actions/OverviewActions";
import jwt from "jsonwebtoken";

import OverviewItem from "../components/OverviewComponents/Item"
import Welcomer from "../components/OverviewComponents/Welcomer"

const OverviewContainer = styled.div`
	display: flex;
  flex-flow: row wrap;
  justify-content: start;
`

class Overview extends React.Component { 
	componentDidMount() {
    if (this.props.token) {
      //verify token
    }

		if (this.props.objects.length == 0) {
			this.props.fetchAllPlantsAndGardens()			
		}
	}

  render() {
    return (
    	<OverviewContainer>
    		<Welcomer />
    		{this.props.objects.map((object, idx) => {
    			return <OverviewItem key={"item-"+idx} {...object} />
    		})}
    	</OverviewContainer>
    );
  }
}

Overview.propTypes = {
	fetchAllPlantsAndGardens: PropTypes.func.isRequired,
}

const MapStateToProps = store => ({
	objects: store.overview.objects,
	isFetching: store.overview.isFetching,
  token: store.auth.currentToken
})

export default connect(MapStateToProps, { fetchAllPlantsAndGardens })(Overview);
