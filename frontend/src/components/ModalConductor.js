import React from 'react';
import { connect } from "react-redux";

import AuthModal from "./modals/Auth"
import CreatePlantModal from "./modals/CreatePlant"
import DeletePlantModal from "./modals/DeletePlant"

import ModalWrapper from "./modals/ModalWrapper"

class ModalConductor extends React.Component { 
	constructor(props) {
		super(props);
		this.state = { currentModal: null }
	}

	componentWillReceiveProps(nextProps){
    var modal = this.state.currentModal
    switch(nextProps.currentModal) {
      case "AUTH_MODAL":
        modal = <AuthModal />
        break 
      case "CREATE_PLANT_MODAL":
        modal = <CreatePlantModal />
        break
      case "DELETE_PLANT_MODAL":
        modal = <DeletePlantModal />
        break
      default:
        modal = null
        break
    }
		this.setState({currentModal:  modal})
	}

  render() {
    return ( 
    	<div>
    	{ this.props.isVisible && 
    		<ModalWrapper>
      		{ this.state.currentModal }
    		</ModalWrapper>
    	}
    	</div>
    );
  }
}

const MapStateToProps = store => ({
  currentModal: store.modal.currentModal,
  isVisible: store.modal.isVisible
})

export default connect(MapStateToProps)(ModalConductor);