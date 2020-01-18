import React from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";

import ItemHeader from "./Header";

class Item extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<ItemContainer>
				<div>
					<div className="image-thumbnail placeholder">
						<h2>No image found</h2>
					</div>

					{this.props.type == "garden" && 
						<div className="image-thumbnail placeholder">
							<h2>No feed found</h2>
						</div>		
					}
				</div>

				<div>
					<ItemHeader 
						name={this.props.name}
						type={this.props.type}
						created_at={this.props.created_at}
						_id={this.props._id} />

						{this.props.children}
				</div>

				<Inline>
					<InspectButton href="#">
						<Link to={this.props.type+"/"+this.props._id}>
							Inspect {this.props.type}
						</Link>
					</InspectButton>
					</Inline>
			</ItemContainer>
		)
	}
}

const Inline = styled.div `
	position: absolute;
	right: 0;
	bottom: 0;
	margin: 10px;
	display: flex;
`

const InspectButton = styled.button`
	a {
		color: black;
		text-decoration: none;		
	}
	border-radius: 5px;
`

const ItemContainer = styled.div`
	display: flex;
	flex-flow: row;
	position: relative;
	margin-bottom: 10px;
	& > div {
		margin-right: 20px;
	}
	& > div:first-child {
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

export default Item;