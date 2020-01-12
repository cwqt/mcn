import React from 'react';
import styled from 'styled-components';

class Navbar extends React.Component { 
	render() {
		return (
			<NavContainer>
				<div className="inline">
					<img src="/leaf.png" />
					<h1>moisture.<br/>&nbsp;&nbsp;track</h1>
				</div>
				<hr />
				<h2>gardens</h2>
					<a href=""><h3>251fa122-29e8-46c8-bcce-b57c59817ebf</h3></a>

				<br />

				<h2>plants</h2>
					<a href="#"><h3>049c0485-ef26-41f3-959c-6b582dbd4b80</h3></a>
					<a href="#"><h3>4ce1bb92-1151-4416-a263-781dc0fa2917</h3></a>
					<a href="#"><h3>3443aa37-166c-479d-a2b2-c5aaa46266f6</h3></a>
					<a href="#"><h3><span>OFFLINE</span>0e30809c-9531-4bd4-8e40-352bf06761b4</h3></a>
					<a href="#"><h3>feee2176-9bdc-43a5-a957-0f39ce24aa0a</h3></a>
					<a href="#"><h3>458d1c98-3215-456e-8c78-fc84e3e5a55e</h3></a>
					<a href="#"><h3>40949c34-6ef4-4475-8ea8-1ceeb57f9532</h3></a>

					<NavFooter>
						<img src="/Git.png" />
						<img src="/Now.png" />
						<img src="/Heroku.png" />
					</NavFooter>
			</NavContainer>
		)	
	}
}

const NavContainer = styled.div`
	position: relative;
	background-color: #eceaea;
	height: 100vh;
	padding: 30px;
	width: 28vw;
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

export default Navbar;