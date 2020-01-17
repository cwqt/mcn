import React from 'react';
import styled from "styled-components";

import OverviewItem from "./OverviewComponents/Item";

class Plant extends React.Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	componentDidMount() {

	}

	render() {
		return (
			<OverviewItem {...this.props}>
				<p>This is a plant</p>
			</OverviewItem>
		)
	}
}

export default Plant;


// import React from 'react';
// import { connect } from "react-redux";
// import { Line } from "react-chartjs-2"
// // import _ from 'lodash';
// import styled from 'styled-components';
// import { lighten } from "polished";
// import { setCurrentModal, setModalVisibility } from "../actions/ModalActions";
// import { selectPlant } from "../actions/PlantActions"
// import PropTypes from "prop-types";

// const PlantContainer = styled.div`
//   display: flex;
//   margin: 10px 0;
//   height: 300px;
//   overflow: hidden;
//   .chartjs {
//     flex: 1;
//     h2 {
//       margin: 0;
//     }
//   }
// `

// const Button = styled.a`
//   margin-left: auto;
//   background-color: rgba(255,255,255,0.05);
//   padding: 10px;
//   color: white;
//   text-decoration: none;
//   border-radius: 4px;
//   box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
//   transition: 0.2s;
//   &:hover {
//     cursor: pointer;
//     background-color: ${lighten(0.03, '#18181b')};
//   }
// `

// const Info = styled.div`
//   width: 100%;
//   display: flex;
//   align-items: center;
//   margin-bottom: 20px;
// `

// const PlantImage = styled.div`
//   width: 300px;
//   margin-right: 20px;
//   overflow: hidden;
//   background: ${props => `url(${props.img})`};
//   background-size: cover;
//   background-position: center center;
//   border-radius: 4px;
// `

// class Plant extends React.Component { 
// 	onClick = e => {
//     e.preventDefault()
//     this.props.selectPlant(this.props._id);
//     this.props.setCurrentModal("DELETE_PLANT_MODAL");
//     this.props.setModalVisibility(true);
// 	}

//   render() { 
//     return (
//     	<PlantContainer>
//         <PlantImage img={this.props.image_url}/>
//         <div className="chartjs">
//           <Info>
//     	  		<h2>{this.props.plant_name}</h2>
//             {this.props.isAuthorised && 
//               <Button onClick={this.onClick}>Delete</Button>
//             }
//           </Info>

//         </div>
//     	</PlantContainer>
//     );
//   }
// }

// Plant.propTypes = {
//   setCurrentModal: PropTypes.func.isRequired,
//   setModalVisibility: PropTypes.func.isRequired,
//   selectPlant: PropTypes.func.isRequired
// }

// const MapStateToProps = store => ({
//   isAuthorised: store.auth.isAuthorised,
//   token: store.auth.currentToken
// })

// export default connect(MapStateToProps, { setCurrentModal, setModalVisibility, selectPlant })(Plant);


