
import React, { Component } from 'react';
import ReactTable from "react-table-6";  
import Modal from 'react-awesome-modal';
import "react-table-6/react-table.css";  
import './App.css';

class AppItems extends Component {
  constructor(props) {
    super(props);
	this.state = {
      data: [],
	  visible : false,
	  productName : '',
	  cost : 0,
	  quantity : 0,
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
			visible : true,
			productName : '',
			cost : 0,
			quantity : 0
        });
    }

    closeModal() {
        this.setState({
			productName : '',
			cost : 0,
			quantity : 0,
            visible : false
        });
    }
	
	updateInput(event){
		if (event.target.name === "name") {
			this.setState({productName : event.target.value})
		} else if (event.target.name === "cost") {
			this.setState({cost : event.target.value})
		} else if (event.target.name === "quantity") {
			this.setState({quantity : event.target.value})
		}
	}
	
	handleKeyPress = (event) => {
	  return event.charCode >= 46 && event.charCode <= 57
	}

	handleSubmit(){
	console.log('Your input value is: ' + this.state.productName)
	return fetch('http://localhost:8070/item/create', {
		  method: 'POST',
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
			  "cost": this.state.cost,
			  "productName": this.state.productName,
			  "quantity": this.state.quantity
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
       Header: 'Product Code',  
       accessor: 'product_code'  
       },{  
       Header: 'Product Name',  
       accessor: 'product_name'  
       },{  
       Header: 'Cost',  
       accessor: 'cost'  
       },{  
       Header: 'Quantity',  
       accessor: 'quantity'  
       }]  

    return (  
          <div>  
			<h3>Items :</h3>
              <ReactTable  id="react_table_data"
                  data={data}  
                  columns={columns}  
                  defaultPageSize = {5}  
                  pageSizeOptions = {[2,4, 6]}  
              />  
			<section>
			<input type="button" class="btn" value="Add Item" onClick={() => this.openModal()} />
			<Modal visible={this.state.visible} width="400" height="300" effect="fadeInUp" onClickAway={() => this.closeModal()}>
				<div>
					<h1>Add New Item</h1>
					<div>
					<label>
						Product Name:
						<input type="text" name="name" class="fields" required onChange={this.updateInput} />
					</label>
					</div>
					<div>
					<label>
						Cost:
						<input type="number" name="cost" class="fields" required onChange={this.updateInput}/>
					</label>
					</div>
					<div>
					<label>
						Quantity:
						<input type="number" name="quantity" class="fields" required onChange={this.updateInput} onKeyPress={this.handleKeyPress}/>
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
    return fetch("http://localhost:8070/item/all/items")
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
export default AppItems;