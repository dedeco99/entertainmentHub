import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addTVSeries } from '../../store/actions/tvSeriesActions'

class AddTVSeries extends Component {
  state = {
    title: '',
    content: ''
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    // console.log(this.state);
    this.props.addTVSeries(this.state);
    //this.props.history.push('/');
  }
  render() {
    return (
      <div className="add-tvseries container">
        <form className="white" onSubmit={this.handleSubmit}>
          <h5 className="grey-text text-darken-3">Add TV Series</h5>
          <div className="input-field">
            <input type="text" id='seriesId' onChange={this.handleChange} />
            <label htmlFor="seriesId">Series Id</label>
          </div>
          <div className="input-field">
            <input type="text" id="title" onChange={this.handleChange} />
            <label htmlFor="title">Series Title</label>
          </div>
          <div className="input-field">
            <button className="btn black lighten-1">Create</button>
          </div>
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addTVSeries: (tvSeries) => dispatch(addTVSeries(tvSeries))
  }
}

export default connect(null, mapDispatchToProps)(AddTVSeries)
