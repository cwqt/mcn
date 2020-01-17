import React from 'react';
import styled from 'styled-components';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setCurrentModal, setModalVisibility } from "../actions/ModalActions";



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
				<div className="inline">
					<img src="/leaf.png" />
					<h1>moisture.<br/>&nbsp;&nbsp;track</h1>
				</div>
				<hr />
				<h2>gardens</h2>
					{this.props.objects.map(object => {
						if (object.type == "garden") {							
							return <a href=""><h3><b>{object.name}</b> {object._id}</h3></a>
						}
					})}
				<br />

				<h2>plants</h2>
					{this.props.objects.map(object => {
						if (object.type == "plant") {
							return <a href=""><h3><b>{object.name}</b> {object._id}</h3></a>
						}
					})}


					<button onClick={this.tryAuth}>Authorise</button>
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
	objects: store.overview.objects
	//now have this.props.objects
})

const NavContainer = styled.div`
	position: relative;
	background-color: #eceaea;
	height: 100vh;
	padding: 30px;
	width: 28vw;
	overflow: hidden;
	display: flex;
	flex-flow: column;

	.inline {
		display: flex;
		align-items: center;
		img {
			height: 50px;
			margin-right: 20px;
			filter: brightness(0.2);
		}
	}
	h1 {
		font-weight: bold;
		color: #333333;
		font-size: 50px;
		line-height: .8
	}
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
		text-decoration: none;
		transition: 0.4s;
		&:hover {
			padding-left: 20px;
		}
	}
	h3 {
		line-height: 1.5;
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
		margin-left: 20px;
		span {
			color: #a3a3a4;
			margin-right: 10px;
		}
	}
`

const NavFooter = styled.div`
	display: flex;
	flex-flow: row;
	justify-content: space-around;
	padding: 0 20%;
	margin-top: auto;
	border-top: 2px solid #dddddd;
	padding-top: 30px;
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

export default connect(MapStateToProps, {setCurrentModal, setModalVisibility})(Navbar);
