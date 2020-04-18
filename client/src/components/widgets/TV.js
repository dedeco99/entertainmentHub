import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Paper from "@material-ui/core/Paper";
import Zoom from "@material-ui/core/Zoom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import CustomScrollbar from "../.partials/CustomScrollbar";

import { getSeasons, getPopular } from "../../api/tv";
import { formatDate } from "../../utils/utils";

import { tv as styles } from "../../styles/Widgets";

class TV extends Component {
	constructor() {
		super();
		this.state = {
			tabIndex: 0,
			loaded: false,
			allEpisodes: [],
			popular: [],
			future: [],
			entered: false,
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleChangeIndex = this.handleChangeIndex.bind(this);
		this.handleEntered = this.handleEntered.bind(this);
		this.handleExit = this.handleExit.bind(this);
	}

	async componentDidMount() {
		await this.getTV();
	}

	async getTV() {
		const response = await Promise.all([
			getSeasons("all", 0, "passed"),
			getPopular(0),
			getSeasons("all", 0, "future"),
		]);

		this.setState({
			loaded: true,
			allEpisodes: response[0].data,
			popular: response[1].data,
			future: response[2].data,
		});
	}

	handleChange(event, newValue) {
		this.setState({ tabIndex: newValue });
	}

	handleChangeIndex(index) {
		this.setState({ tabIndex: index });
	}

	renderPopularList() {
		const { classes } = this.props;
		const { popular } = this.state;

		const popularList = popular.map(serie => (
			<ListItem key={serie.id} button divider>
				<img src={serie.image} height="100x" alt="Series" />
				<Typography variant="body1" className={classes.popularText}> {serie.displayName} </Typography>
			</ListItem >
		));

		return <CustomScrollbar> <List> {popularList} </List> </CustomScrollbar>;
	}

	renderEpisodeList(episodes) {
		const { classes } = this.props;

		const episodeList = episodes.map(episode => {
			const seasonLabel = episode.season > 9 ? `S${episode.season}` : `S0${episode.season}`;
			const episodeLabel = episode.number > 9 ? `E${episode.number}` : `E0${episode.number}`;

			return (
				<ListItem className={classes.episodeList} alignItems="flex-start" key={episode._id} button divider>
					<Box display="flex" width="100%">
						<Typography className={classes.episodeName} variant="body1"> {episode.seriesId.displayName} </Typography>
						<Typography className={classes.episodeDate} variant="caption"> {formatDate(episode.date, "DD-MM-YYYY")} </Typography>
					</Box>
					<Typography variant="body2"> {`${seasonLabel + episodeLabel} - ${episode.title}`} </Typography>
				</ListItem >
			);
		});

		return <CustomScrollbar> <List component="div"> {episodeList} </List> </CustomScrollbar>;
	}

	a11yTabProps(index) {
		return {
			id: `tvwidget-tab-${index}`,
			"aria-controls": `tvwidget-tabpanel-${index}`,
		};
	}

	a11yTabPanelProps(index) {
		return {
			id: `tvwidget-tabpanel-${index}`,
			"aria-labelledby": `tvwidget-tab-${index}`,
		};
	}

	handleEntered() {
		this.setState({ entered: true });
	}

	handleExit() {
		this.setState({ entered: false });
	}

	render() {
		const { tabIndex, loaded, allEpisodes, future, entered } = this.state;
		const { classes } = this.props;

		return (
			<Zoom in={loaded} onEntered={this.handleEntered} onExit={this.handleExit}>
				<div className={classes.root}>
					<Paper square>
						<Tabs value={entered ? tabIndex : false} onChange={this.handleChange} variant="fullWidth" classes={{ indicator: classes.indicator }}>
							<Tab label="All" className={classes.tab} {...this.a11yTabProps(0)} />
							<Tab label="Popular" className={classes.tab} {...this.a11yTabProps(1)} />
							<Tab label="Future" className={classes.tab} {...this.a11yTabProps(2)} />
						</Tabs>
					</Paper>
					<div role="tabpanel" hidden={tabIndex !== 0} className={classes.tabPanel} {...this.a11yTabPanelProps(0)}>
						{tabIndex === 0 && this.renderEpisodeList(allEpisodes)}
					</div>
					<div role="tabpanel" hidden={tabIndex !== 1} className={classes.tabPanel} {...this.a11yTabPanelProps(1)}>
						{tabIndex === 1 && this.renderPopularList()}
					</div>
					<div role="tabpanel" hidden={tabIndex !== 2} className={classes.tabPanel} {...this.a11yTabPanelProps(2)}>
						{tabIndex === 2 && this.renderEpisodeList(future)}
					</div>
				</div>
			</Zoom>
		);
	}
}

TV.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TV);
