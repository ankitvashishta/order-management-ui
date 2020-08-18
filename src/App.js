
import React, { Component, Fragment } from 'react';
import AppOrders from './AppOrders'; 
import AppItems from './AppItems'; 
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (  
         <React.Fragment>
			<AppItems />
			
			<AppOrders />
	  </React.Fragment>
    )  
  }

}
export default App;