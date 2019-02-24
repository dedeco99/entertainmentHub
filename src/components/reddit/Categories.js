import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = theme => ({
  bar: {
    backgroundColor: "#222",
  },
  indicator: {
    backgroundColor: "#FFF",
  },
});

class Categories extends Component {
  state = {
    tab:0
  }
  handleChange = (event, tab) => {
    this.setState({ tab });
  };

  render() {
    const {classes} = this.props;

    return (
      <AppBar position="static" className={classes.bar}>
        <Tabs value={this.state.tab} onChange={this.handleChange} classes={{indicator: classes.indicator}}>
          <Tab label="Hot" />
          <Tab label="New" />
          <Tab label="Rising" />
          <Tab label="Controversial" />
          <Tab label="Top" />
          <Tab label="Gilded" />
        </Tabs>
      </AppBar>
    );
  }
}

Categories.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Categories);
