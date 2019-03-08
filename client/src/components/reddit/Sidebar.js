import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { getPosts } from "../../store/actions/redditActions";
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Categories from "./Categories";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
		backgroundColor: "#222"
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});

class Sidebar extends React.Component {
  state = {
    open: false,
    subreddit: "all",
    category: "hot"
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  updateCategory = (category) => {
    this.setState({ category });
  }

  getPosts = (subreddit) => {
    this.setState({ subreddit },() => {
      this.props.getPosts(this.state.subreddit, this.state.category);
    });
  };

  render() {
    const { classes, theme, options } = this.props;
    const { open } = this.state;

		const optionsList = options.length>0 ? (
			options.map(option => {
				return (
					<ListItem button key={option.id} onClick={() => {this.getPosts(option.id)}}>
						<ListItemText primary={option.displayName} />
					</ListItem>
				)
			})
		) : (
			<ListItem button key="1">
				<ListItemText primary="Nothing to see here..." />
			</ListItem>
		)

    return (
      <div className={classes.root}>
				<IconButton
					color="inherit"
					aria-label="Open drawer"
					onClick={this.handleDrawerOpen}
					className={classNames(classes.menuButton)}
				>
					Menu
				</IconButton>
        <Categories subreddit={this.state.subreddit} updateCategory={this.updateCategory} />
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'ltr' ? "Left" : "Right"}
            </IconButton>
          </div>
          <Divider />
          <List>
						{ optionsList }
          </List>
        </Drawer>
      </div>
    );
  }
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => {
	return {
		getPosts: (subreddit, category) => dispatch(getPosts(subreddit, category))
	}
}

export default connect(null, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Sidebar));
