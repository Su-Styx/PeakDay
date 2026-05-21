import React from 'react';
import './App.css';
import axios from 'axios';


class App extends React.Component{

  state = {
    details: [],
  };
   
  componentDidMount(){

    let data;
// note below is the listening url for the django backend
    axios.get('http://localhost:8000/reactview/') 
    .then(res => {
      data = res.data;
      this.setState({
        details: data
      });
    })
    .catch(err => { })

  }


  render(){
    return (
      <div>
        <header>
          The Following Data Came for Django Backend at localhost 8000.
        </header>
        <hr></hr>
        {this.state.details.map((output, id) => (
          <div key={id}>
            <div>
              <h2>{output.employee}</h2>
              <h3>{output.department}</h3>
            </div>
          </div>
        ))}
      </div>
    )
  }

}

export default App;