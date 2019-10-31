import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

class Categories extends Component {
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
	};

	render() {
		const { options, idField, nameField } = this.props;
		const { selectedMenu } = this.state;

		const optionsList = options.map(option => {
			return (
				<ListItem
					button
					selected={selectedMenu === option[idField]}
					onClick={() => this.handleClick(option[idField])}
					key={option[idField]}
					id={option[idField]}
					style={{ textAlign: "center" }}
				>
					<ListItemText primary={option[nameField]} />
				</ListItem >
			)
		});

		return (
			<List className="list-menu horizontal">
				{optionsList}
			</List>
		);
	}
}

export default Categories;