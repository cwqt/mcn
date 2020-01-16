import React from 'react';
import styled from "styled-components";


class Garden extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			_id: "",
			creation_date: "1578665421754",
			feed_url: "",

			stats: {
				"humdity": "12%",
				"temperature": "21c",
				"avg. moisture": "571",
				"light level": "391 lumen",
				"reservoir": "58%"
			}
		}
	}

	componentDidMount() {

	}

	render() {
		return (
			<GardenContainer>
				<div>
					<div className="image-thumbnail placeholder">
						<h2>No image found</h2>
					</div>

					<div className="image-thumbnail placeholder">
						<h2>No feed found</h2>
					</div>	
				</div>

				<div>
					<h1>{this.state._id}</h1>
					<h4>online since: <b>{this.state.start_date}</b></h4>
					<hr />
					{/*Object.keys(this.state.stats).map((stat, i) => {
						return <p>{stat}: <b>{this.state.stats[stat]}</b></p>
					})*/}

					<InspectButton href="#">Inspect garden</InspectButton>

				</div>
			</GardenContainer>
		)
	}
}

const InspectButton = styled.a`
	position: absolute;
	right: 0;
	bottom: 0;
	margin: 10px;
	padding: 10px;
	color: black;
	text-decoration: none;
	border-radius: 5px;
	background-color: #eceaea;
`

const GardenContainer = styled.div`
	display: flex;
	flex-flow: row;
	position: relative;
	margin-bottom: 10px;
	& > div {
		margin-right: 20px;
	}
	div:first-child {
		width: 30%;
		.image-thumbnail {
			border-radius: 5px;
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 150px;
			margin-bottom: 10px;
			width: auto;
			position: relative;
			&.placeholder {
				background-color: #eceaea;
				h2 {
					opacity: 0.8;
					margin: auto;
				}
			}
		}
	}
	div:nth-child(2) {
		width: 70%;
		h4 {
			margin-top: 10px;
		}
	}
`

export default Garden;