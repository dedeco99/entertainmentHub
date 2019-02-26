import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { getPosts } from "../../store/actions/redditActions";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = theme => ({
  bar: {
    flex:0.9,
    backgroundColor: "#222"
  },
  indicator: {
    backgroundColor: "#FFF",
  },
});

class Categories extends Component {
  state = {
    tab:0,
    subreddit:"all",
    category:"hot"
  }

  handleChange = (event, tab) => {
    this.setState({ tab },() => {
      (this.props.getPosts(this.state.subreddit,this.state.category));
    });
  };

  render() {
    const {classes} = this.props;
    const {tab} = this.state;

    return (
      <AppBar position="static" className={classes.bar}>
        <Tabs value={tab} onChange={this.handleChange} classes={{indicator: classes.indicator}}>
          <Tab label="hot" />
          <Tab label="new" />
          <Tab label="rising" />
          <Tab label="controversial" />
          <Tab label="top" />
          <Tab label="gilded" />
        </Tabs>
      </AppBar>
    );
  }
}

Categories.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => {
	return {
		getPosts: (subreddit, category) => dispatch(getPosts(subreddit, category))
	}
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(Categories));
