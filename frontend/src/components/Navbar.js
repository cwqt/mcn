import React from 'react';
import styled from 'styled-components';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import EventsList from "./EventsList";

class Navbar extends React.Component {
	render() {
		let links = [
			["https://gitlab.com/cxss/moisture.track", "/Git.png"],
			["https://zeit.co/cxss/moisture.track", "/Now.png"],
			["https://dashboard.heroku.com/apps/hydroponics-api", "/Heroku.png"]
		]

		return (
			<NavContainer>
				<NavList>
					<h2>Gardens</h2>
						{this.props.objects.map((object, idx) => {
							if (object.type == "garden") {
								return (
									<div>
										<NavLink activeClassName="selected"
										key={idx}
										to={"/garden/"+object._id}>
											<h3><b>{object.name}</b> {object._id}</h3>
										</NavLink>
										<div className="subplants">
											{ object.plants.map(plant => <NavLink to={"/plant/"+plant._id}>{plant._id}</NavLink>) }
										</div>
									</div>
								)
							}
						})}
					<br />

					<h2>Plants</h2>
						{this.props.objects.map((object, idx) => {
							if (object.type == "plant") {
								return <NavLink activeClassName="selected"
									key={idx}
									to={"/"+object.type+"/"+object._id}>
									<h3><b>{object.name}</b> {object._id}</h3>
									</NavLink>
							}
						})}
				</NavList>


					{/* !this.props.isAuthorised &&
						<AuthButton onClick={this.tryAuth}><p>Authenticate</p></AuthButton>
					*/}
					<EventsList />
					<NavFooter>
						{links.map(link => {
							return <a href={link[0]} target="_blank"><img src={link[1]}/></a>
						})}
					</NavFooter>
			</NavContainer>
		)	
	}
}

const MapStateToProps = store => ({
	//root reducer returns objects
	//PlantReducer has state with items
	objects: store.overview.objects,
	isAuthorised: store.auth.isAuthorised
	//now have this.props.objects
})

const NavContainer = styled.div`
	background-color: rgba(0,0,0,0.05);
	position: relative;
	height: 91vh;
	padding: 15px;
	padding-top: 5vh;
	width: 28vw;
	overflow: hidden;
	display: flex;
	flex-flow: column;


	.subplants {
		display: none;
	}
	.selected + .subplants {
		display: block;
		opacity: 0.8;
		margin-bottom: 5px;
		margin-left: 20px;
	}

	h2 {
		color: #333333;
		font-weight: 400;
		margin-bottom: 10px;
		position: relative;
		padding-left: 20px;
		&::before {
			position: absolute;
			top: -2px;
			left: 0px;
			content: "§ ";
			color: #a3a3a4;
		}
	}

	a {
		color: #000;
		display: flex;
		text-decoration: none;
	  &::before {
	  	content: "→ ";
	  	opacity: 0;
	  	padding-right: 10px;
	  	margin-top: 4px;
	  	transition: 0.2s;
	  }
	  &:hover {
	  	&::before {
	  		opacity: 0.5;
	  	}
	  }
		&.selected {
			&::before {
				opacity: 1;
			}
		}
		h3 {
			line-height: 1.5;
		  white-space: nowrap;
		  overflow: hidden;
		  text-overflow: ellipsis;
		}
	}
`

const NavList = styled.div`
	background: white;
	border-radius: 20px;
	overflow: hidden;
	padding: 20px;
`

const NavFooter = styled.div`
	margin-bottom: 20px;
	background: white;
	border-radius: 20px;
	display: flex;
	flex-flow: row;
	justify-content: space-around;
	padding: 20px 40px;
	img {
		height: 30px;
		filter: brightness(0.75);
		transition: 0.3s;
		&:hover {
			filter: brightness(0.6);
			cursor: pointer;
		}
	}
`

const AuthButton = styled.button`
	border-radius: 20px;
	overflow: hidden;
	background-image: url(http://s7.favim.com/orig/150709/aesthetic-aesthetics-bambi-bathroom-Favim.com-2928004.jpg);
	background-size: cover;
	background-position: bottom;
	margin: 20px 0;
	padding: 0;
	&:hover {
		box-shadow: 0 9px 30px 0 rgba(35,39,42,.1);		
	}

	p {
		letter-spacing: 1px;
		margin: 0;
		color: #333;
		text-align: left;
		background-color: white;
		margin-top: 100px;
		padding: 20px;
		padding-left: 30px;
		font-weight: bold;
		border: 2px solid transparent;
	}
`

export default connect(MapStateToProps, {})(Navbar);
