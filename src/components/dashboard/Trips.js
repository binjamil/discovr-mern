import React, { Component } from "react";
import axios from "axios";
import moment from "moment";

class Trips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trips: []
    };
  }

  componentDidMount() {
    axios
      .get("/trips/")
      .then(res => {
        console.log(res.data);
        this.setState({ trips: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="container">
        <div className="divider"></div>
        <div className="row">
          <div className="col s12 m8 offset-m2">
            <h4 style={{ paddingLeft: "24px" }}>Active Trips</h4>
            {this.state.trips.map(trip => {
              return (
                <div className="card z-depth-0 darken-1" key={trip._id}>
                  <div className="card-content">
                    <span className="card-title">{trip.title}</span>
                    <p>{trip.description}</p>
                  </div>
                  <div className="card-action row">
                    <span className="col s6">
                      {moment(trip.date.toString()).format("MMMM Do, YYYY")}
                    </span>
                    <span className="col s6 right-align">Rs. {trip.price}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Trips;
