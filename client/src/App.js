import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
  };

  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      this.setState({ intervalIsSet: setInterval(this.getDataFromDb, 1000)});
    }
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getDataFromDb = () => {
    fetch('http://localhost:3001/api/data')
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  }

  postDataToDb = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post('http://localhost:3001/api/data', {
      id: idToBeAdded,
      message,
    });
  }

  deleteFromDb = idToDelete => {
    let objIdtoDelete = null;
    this.state.data.forEach(item => {
      if (item.id === idToDelete) {
        objIdtoDelete = item._id;
      }
    });

    axios.delete('http://localhost:3001/api/data', {
      data: {
        id: objIdtoDelete,
      },
    });
  }

  updateDb = (idToUpdate, updateToApply) => {
    let objectIdToUpdate = null;
    this.state.data.forEach(item => {
      if (item.id === idToUpdate) {
        objectIdToUpdate = item._id;
      }
    });

    axios.put('http://localhost:3001/api/data', {
      id: objectIdToUpdate,
      upate: { message: updateToApply },
    });
  }

  render () {
    const { data } = this.state;
    return (
      <div>
      <ul>
         {data.length <= 0
           ? "NO DB ENTRIES YET"
           : data.map(dat => (
               <li style={{ padding: "10px" }} key={data.message}>
                 <span style={{ color: "gray" }}> id: </span> {dat.id} <br />
                 <span style={{ color: "gray" }}> data: </span>
                 {dat.message}
               </li>
             ))}
       </ul>
       <div style={{ padding: "10px" }}>
         <input
           type="text"
           onChange={e => this.setState({ message: e.target.value })}
           placeholder="add something in the database"
           style={{ width: "200px" }}
         />
         <button onClick={() => this.postDataToDb(this.state.message)}>
           ADD
         </button>
       </div>
       <div style={{ padding: "10px" }}>
         <input
           type="text"
           style={{ width: "200px" }}
           onChange={e => this.setState({ idToDelete: e.target.value })}
           placeholder="put id of item to delete here"
         />
         <button onClick={() => this.deleteFromDb(this.state.idToDelete)}>
           DELETE
         </button>
       </div>
       <div style={{ padding: "10px" }}>
         <input
           type="text"
           style={{ width: "200px" }}
           onChange={e => this.setState({ idToUpdate: e.target.value })}
           placeholder="id of item to update here"
         />
         <input
           type="text"
           style={{ width: "200px" }}
           onChange={e => this.setState({ updateToApply: e.target.value })}
           placeholder="put new value of the item here"
         />
         <button
           onClick={() =>
             this.updateDB(this.state.idToUpdate, this.state.updateToApply)
           }
         >
           UPDATE
         </button>
       </div>
      </div>
    );
  }
}

export default App;
