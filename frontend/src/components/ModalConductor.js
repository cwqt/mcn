import React from 'react';
import { connect } from "react-redux";

import AuthModal              from "./modals/Auth"
import CreateRecordableModal  from "./modals/CreateRecordable"
import DeleteRecordableModal  from "./modals/DeleteRecordable"
import EditRecordableModal    from "./modals/EditRecordableProps"

import ModalWrapper           from "./modals/ModalWrapper"

class ModalConductor extends React.Component { 
	constructor(props) {
		super(props);
		this.state = { currentModal: null }
	}

	componentWillReceiveProps(nextProps){
    var modalMap = {
      "AUTH_MODAL": <AuthModal />,
      "DELETE_RECORDABLE": <DeleteRecordableModal />,
      //errmm...
      "CREATE_RECORDABLE_PLANT": <CreateRecordableModal plant/>,
      "CREATE_RECORDABLE_GARDEN": <CreateRecordableModal garden/>,
      "EDIT_RECORDABLE": <EditRecordableModal />
    }
    var modal = modalMap[nextProps.currentModal] || null;
		this.setState({currentModal:  modal})
	}

  render() {
    if (!this.props.isVisible) { return null }
    return ( 
    	<div>
    		<ModalWrapper>
      		{ this.state.currentModal }
    		</ModalWrapper>
    	</div>
    );
  }
}

const MapStateToProps = store => ({
  currentModal: store.modal.currentModal,
  isVisible: store.modal.isVisible
})

export default connect(MapStateToProps)(ModalConductor);