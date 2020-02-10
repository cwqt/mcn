import React from 'react';
import styled from 'styled-components';

const EventsListContainer = styled.header`
  display: flex;
  flex-flow: column;
  border-radius: 4px;
  padding: 20px;
  margin-top: auto;
  background: white;
  border-radius: 20px;
  margin-bottom: 10px;
  p {
    margin: 0;
    margin-bottom: 10px;
    font-size: 18.72px;
    margin-left: 26px;
  }
  h2 {
    margin-bottom: 10px !important;
  }
`

class EventsList extends React.Component { 
  render() {  	
    return (
    	<EventsListContainer>
      <h2>Recent events</h2>
      <p>Watered <b>VÄXER</b> <span>8 minutes ago</span></p>
      <p>Refilled tank <b>VÄXER</b> <span>3 hours ago</span></p>
      <p>Watered <b>Singular plant</b> <span>1 day ago</span></p>
    	</EventsListContainer>
    );
  }
}

export default EventsList;
