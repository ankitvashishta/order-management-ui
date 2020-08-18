
import React, { Component } from 'react';
import ReactTable from "react-table-6";  
import Modal from 'react-awesome-modal';
import "react-table-6/react-table.css";  
import './App.css';

class AppOrders extends Component {
  constructor(props) {
    super(props);
	this.state = {
      data: [],
	  visible : false,
	  shouldHide: true
    }
	this.updateInput = this.updateInput.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  componentDidMount() {
      this.retrieveItems();
  }
  
   openModal() {
        this.setState({
			visible : true
        });
    }

    closeModal() {
        this.setState({
            visible : false
        });
    }
	
	updateInput(event){
		if (event.target.name === "customerName") {
			this.setState({customerName : event.target.value})
		} else if (event.target.name === "shippingAddress") {
			this.setState({shippingAddress : event.target.value})
		} else if (event.target.name === "productCode") {
			this.setState({productCode : event.target.value})
		} else if (event.target.name === "quantity") {
			this.setState({quantity : event.target.value})
	}
	}
	

	handleSubmit(){
	let prodCode = this.state.productCode;
	return fetch('http://localhost:8080/order/create', {
		  method: 'POST',
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
			  "customerName": this.state.customerName,
			  "shippingAddress": this.state.shippingAddress,
			  "items": {
			  [prodCode] : Number(this.state.quantity)
			  }
		  })
		}).then(response => {
			return response.json();
		  })
		  .then(json => {
			this.retrieveItems();
			if(json.status === 400) {
				this.state.shouldHide = false;
			} else {
				this.closeModal();
			}
			return json;
		  })
		  .catch(error => {
			console.log(error);
		  });
	}
 
  
  render() {
	const data = this.state.data  
    const columns = [{  
       Header: 'Id',  
       accessor: 'id'  
       },{  
       Header: 'Customer Name',  
       accessor: 'customer'  
       },{  
       Header: 'Order Date',  
       accessor: 'order_date'  
       },{  
       Header: 'Shipping Address',  
       accessor: 'shipping_address'  
       },{  
       Header: 'Order Items',  
       accessor: 'order_items'  
       },{  
       Header: 'Total',  
       accessor: 'total'  
       }]  

    return (  
          <div id= "orders">  
		  <h3>Orders :</h3>
              <ReactTable 
                  data={data}  
                  columns={columns}  
                  defaultPageSize = {5}  
                  pageSizeOptions = {[2,4, 6]}  
              />  
			<section>
			
			<input type="button" class="btn" value="Add Order" onClick={() => this.openModal()} />
			<Modal visible={this.state.visible} width="400" height="300" effect="fadeInUp" onClickAway={() => this.closeModal()}>
				<div>
					<h1>Add New Order</h1>
					<div>
					<label>
						Customer Name:
						<input type="text" name="customerName" class="fields" required onChange={this.updateInput} />
					</label>
					</div>
					<div>
					<label>
						Shipping Adress:
						<input type="text" name="shippingAddress" class="fields" required onChange={this.updateInput}/>
					</label>
					</div>
					<div>
					<label>
						Item(Product Code) :
						<input type="number" name="productCode" class="fields" required onChange={this.updateInput}/>
					</label>
					</div>
					<div>
					<label>
						Item(Quantity) :
						<input type="number" name="quantity" class="fields" required onChange={this.updateInput}/>
					</label>
					</div>
					<input type="button" class="btn saveBtn" value="Save" onClick={this.handleSubmit} />
					<a href="javascript:void(0);" onClick={() => this.closeModal()}>Close</a>
					<p className={this.state.shouldHide ? 'error' : ''}><span class="noError">All feilds are required</span></p>
				</div>
			</Modal>
			</section>
          </div>        
    )  
  }
  

  


   async retrieveItems() {
    return fetch("http://localhost:8080/order/all/orders")
      .then(response => {
        return response.json();
      })
      .then(json => {
	  this.setState({
        data: json
      })
        console.log("Retrieved items:");
        return json;
      })
      .catch(error => {
        console.log(error);
      });
  }

}
export default AppOrders;