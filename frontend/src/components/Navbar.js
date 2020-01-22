import React from 'react';
import styled from 'styled-components';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setCurrentModal, setModalVisibility } from "../actions/ModalActions";
import { Link, NavLink } from "react-router-dom";

class Navbar extends React.Component {
  tryAuth = e => {
    console.log("test")
    e.preventDefault()
    this.props.setCurrentModal("AUTH_MODAL");
    this.props.setModalVisibility(true);
  }

	render() {
		return (
			<NavContainer>
				<NavList>
					<h2>gardens</h2>
						{this.props.objects.map((object, idx) => {
							if (object.type == "garden") {
								return <NavLink activeClassName="selected"
									key={idx}
									to={"/"+object.type+"/"+object._id}>
									<h3><b>{object.name}</b> {object._id}</h3>
									</NavLink>
							}
						})}
					<br />

					<h2>plants</h2>
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


					{ !this.props.isAuthorised &&
						<AuthButton onClick={this.tryAuth}><p>Authenticate</p></AuthButton>
					}
					<NavFooter>
						<img alt="" src="/Git.png" />
						<img alt="" src="/Now.png" />
						<img alt="" src="/Heroku.png" />
					</NavFooter>
			</NavContainer>
		)	
	}
}

Navbar.propTypes = {
	setCurrentModal: PropTypes.func.isRequired,
	setModalVisibility: PropTypes.func.isRequired,
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


	h2 {
		color: #333333;
		font-weight: 400;
		margin-bottom: 10px;
		&:before {
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
	margin-top: auto;
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

export default connect(MapStateToProps, {setCurrentModal, setModalVisibility})(Navbar);
