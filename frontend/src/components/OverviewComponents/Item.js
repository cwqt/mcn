import React from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import Slider from "react-slick";
import moment from 'moment';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class Item extends React.Component {
	constructor(props) {
		super(props)
	}

	showInfo = () => {
		this.slider.slickGoTo(1)
	}

	render() {
	  var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
		return (
			<ItemContainer url={this.props.image}>

				<ItemFooter>
					<p>{this.props.name}</p>
		
						<StyledLink to={this.props.type+"/"+this.props._id}>
							Inspect {this.props.type}<p>→</p>
						</StyledLink>
		
					<i className="material-icons" onClick={this.showInfo}>info</i>
					{this.props.type == "garden" &&
						<GardenCounter>{this.props.plants.length}</GardenCounter>
					}
				</ItemFooter>

				<Slider ref={slider => (this.slider = slider)} {...settings}>
					<div></div>
					<ItemContent>
						<p><b>_id: </b>{this.props._id}</p>
						<p><b>last updated: </b>{moment.unix(this.props.most_recent.timestamp).fromNow()}</p>
						<p><b>metrics: </b>{Object.keys(this.props.most_recent.measurements).map(type => type+", ")}</p>
						{ this.props.type == "garden" &&
							<p><b>plants: </b>{this.props.plants.length}</p>
						}
					</ItemContent>
				</Slider>
			</ItemContainer>
		)
	}
}


const ItemContainer = styled.div`
	flex: 1 0 calc(33.333% - 10px);
	max-width: calc(33.333% - 10px);
  margin: 0 5px;
	
	position: relative;
	margin-bottom: 10px;
	background-color: white;
	border-radius: 20px;
	overflow: hidden;
	height: 30vh;
	background-image: url(${props => props.url});
	background-size: cover;
	background-position: center;
	transition: 0.2s;
	&:hover {
		box-shadow: 0 9px 30px 0 rgba(35,39,42,.1);		
	}
`

const ItemFooter = styled.div`
	position: absolute;
	bottom: 0;
	width: 100%;
	display: flex;
	background-color: white;
	justify-content: space-between;
	align-items: center;
	padding: 20px;
	p {
		margin: 0;
		font-weight: bold;
		letter-spacing: 1px;
		color: #333;
	}

	i {
		position: absolute;
		right: 10px;
		top: -10px;
		background: #f3f3f3;
		border-radius: 50%;
		color: #333;
		transition: 0.2s;
		&:hover {
			cursor: pointer;
			transform: scale(1.2)
		}
	}
`

const StyledLink = styled(Link)`
	border-radius: 24px;
	padding: 15px 25px;
	padding-right: 35px;
	background-color: #f3f3f3;
	color: #333;
	text-decoration: none;
	&:hover {
		p {
			opacity: 1;
			transform: translateX(10px);
		}
	}
	p {
		margin: 0;
		display: inline-block;	
		opacity: .3;
		margin-left: 10px;
		transition: 0.5s;
	}
`

const ItemContent = styled.div`
	margin-top: 10px;
	padding: 15px;
	background: white;
	border-radius: 20px;
	overflow: hidden;
	box-shadow: 0 9px 30px 0 rgba(35,39,42,.1);
	p:first-child {
		margin-top: 0
	}
	p:last-child {
		margin-bottom: 0
	}
`

const GardenCounter = styled.div`
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: bold;
	top: -15px;
	background-color: #fff;
	border-radius: 50%;
	width: 40px;
	height: 40px;
`

export default Item;