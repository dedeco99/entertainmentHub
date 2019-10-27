import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import loading from "../../img/loading2.gif";

class Sidebar extends Component {
	constructor() {
		super();
		this.state = {
			selectedMenu: 0,
		};

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(id) {
		this.props.action(id);

		this.setState({ selectedMenu: id });
	}

	render() {
		const { options, idField } = this.props;
		const { selectedMenu } = this.state;

		let optionsList = <div className="loading" align="center"><img src={loading} alt="Loading..." /></div>;
		if (options && options.length > 0) {
			optionsList = options.map(option => {
				return (
					<ListItem
						button
						selected={selectedMenu === option[idField]}
						onClick={() => this.handleClick(option[idField])}
						key={option[idField]}
						id={option[idField]}
					>
						<ListItemText primary={option.displayName} />
					</ListItem >
				);
			});
		}

		return (
			<List className="list-menu" >
				{optionsList}
			</List>
		);
	}
}

export default Sidebar;
