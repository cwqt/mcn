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
`

class EventsList extends React.Component { 
  render() {  	
    return (
    	<EventsListContainer>
      <h2>Recent events</h2>
      <p>pog</p>
    	</EventsListContainer>
    );
  }
}

export default EventsList;
