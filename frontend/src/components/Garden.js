import React from 'react';
import styled from "styled-components";

import OverviewItem from "./OverviewComponents/Item";

class Garden extends React.Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	componentDidMount() {

	}

	render() {
		return (
			<OverviewItem {...this.props}>
				<p>Has <b>{this.props.plants.length}</b> plants</p>
				{this.props.plants.map(plant => {
					return <h3>{plant._id}</h3>
				})}
			</OverviewItem>
		)
	}

	// render() {
	// 	return (
	// 		<GardenContainer>
	// 			<div>
	// 				<div className="image-thumbnail placeholder">
	// 					<h2>No image found</h2>
	// 				</div>

	// 				<div className="image-thumbnail placeholder">
	// 					<h2>No feed found</h2>
	// 				</div>	
	// 			</div>

	// 			<div>
	// 				<Item_header 
	// 					name={this.props.name}
	// 					type={this.props.type}
	// 					created_at={this.props.created_at}
	// 					_id={this.props._id} />



	// 				{/*Object.keys(this.state.stats).map((stat, i) => {
	// 					return <p>{stat}: <b>{this.state.stats[stat]}</b></p>
	// 				})*/}
	// 				{this.props.plants.map(plant => {
	// 					return <h3>{plant._id}</h3>
	// 				})}

	// 				<InspectButton href="#">Inspect garden</InspectButton>

	// 			</div>
	// 		</GardenContainer>
	// 	)
	// }
}

export default Garden;