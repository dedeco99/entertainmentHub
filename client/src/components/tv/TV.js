import React, { useContext, useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { makeStyles, Grid, Fab, Button } from "@material-ui/core";

import Sidebar from "../.partials/Sidebar";
import SeriesDetail from "./SeriesDetail";
import Episodes from "./Episodes";
import Search from "./Search";
import Banners from "./Banners";

import { TVContext } from "../../contexts/TVContext";

import { getSeasons, getPopular } from "../../api/tv";
import { getSubscriptions, editSubscription, deleteSubscription } from "../../api/subscriptions";

import loadingGif from "../../img/loading3.gif";

import { tv as styles } from "../../styles/TV";

const useStyles = makeStyles(styles);

function TV() {
	const history = useHistory();
	const match = useRouteMatch();
	const classes = useStyles();
	const { state, dispatch } = useContext(TVContext);
	const { subscriptions } = state;
	const [seasons, setSeasons] = useState([]);
	const [episodes, setEpisodes] = useState([]);
	const [popular, setPopular] = useState([]);
	const [currentSeries, setCurrentSeries] = useState("all");
	const [selectedSeries, setSelectedSeries] = useState(null);
	const [pagination, setPagination] = useState({
		allPage: 0,
		allHasMore: false,
		popularPage: 0,
		popularHasMore: false,
		episodeFilter: "all",
	});
	const [loadingSeries, setLoadingSeries] = useState(false);
	const [loadingPopular, setLoadingPopular] = useState(false);
	const [loadingAll, setLoadingAll] = useState(false);
	const [blocks, setBlocks] = useState({
		openSearch: false,
		openPopular: false,
		openEpisodes: false,
	});
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		async function fetchData() {
			setLoadingSeries(true);

			const response = await getSubscriptions("tv");

			dispatch({ type: "SET_SUBSCRIPTIONS", subscriptions: response.data });
			setLoadingSeries(false);
		}

		fetchData();
	}, []);

	function updateUrlFilter(seriesId, season) {
		history.push(`/tv/${seriesId}/${season}`);
	}

	async function handleGetAll() {
		if (!loadingAll) {
			setLoadingAll(true);

			const response = await getSeasons("all", pagination.allPage, pagination.episodeFilter);

			const newEpisodes = pagination.allPage === 0 ? response.data : episodes.concat(response.data);

			setEpisodes(newEpisodes);
			setCurrentSeries("all");
			setPagination({
				...pagination,
				allPage: pagination.allPage + 1,
				allHasMore: !(response.data.length < 50),
			});
			setBlocks({
				openSearch: false,
				openPopular: false,
				openEpisodes: true,
			});
			setLoadingAll(false);
		}
	}

	function handleSeasonChange(season) {
		updateUrlFilter(currentSeries, season);
	}

	async function handleGetSeasons(seriesId) {
		const response = await getSeasons(seriesId);

		if (response.status === 200) {
			setCurrentSeries(seriesId);
			setSeasons(response.data);
			setPagination({ ...pagination, allPage: 0 });
		}
	}

	function handleGetEpisodes(season) {
		const foundSeason = seasons.find(s => s._id === Number(season));

		if (foundSeason) {
			setEpisodes(foundSeason.episodes);
			setBlocks({
				openSearch: false,
				openPopular: false,
				openEpisodes: true,
			});
		} else {
			history.replace(`/tv/${currentSeries}/${seasons[seasons.length - 1]._id}`);
		}
	}

	function handleGetInfo(seriesId, season) {
		if (seriesId === currentSeries) {
			handleGetEpisodes(season);
		} else {
			handleGetSeasons(seriesId);
		}
	}

	async function handleGetPopular() {
		if (!loadingPopular) {
			setLoadingPopular(true);

			const response = await getPopular(pagination.popularPage);

			const newPopular = pagination.popularPage === 0 ? response.data : popular.concat(response.data);

			setPopular(newPopular);
			setPagination({
				...pagination,
				popularPage: pagination.popularPage + 1,
				popularHasMore: !(response.data.length < 20),
			});
			setBlocks({
				openSearch: false,
				openPopular: true,
				openEpisodes: false,
			});
			setLoadingPopular(false);
		}
	}

	async function handleEditSeries(id, show) {
		const response = await editSubscription(id, show);

		if (response.status === 200) {
			dispatch({ type: "EDIT_SUBSCRIPTION", subscription: response.data });
		}
	}

	async function handleDeleteSeries(e) {
		const foundSeries = subscriptions.find(s => s.externalId === e.target.id);

		const response = await deleteSubscription(foundSeries._id);

		if (response.status === 200) {
			dispatch({ type: "DELETE_SUBSCRIPTION", subscription: response.data });
		}
	}

	function handleShowSearchBlock() {
		setBlocks({ openSearch: true, openPopular: false, openEpisodes: false });
	}

	function handleShowPopularBlock() {
		history.push("/tv/popular");

		setPopular([]);
		setPagination({ ...pagination, popularPage: 0, popularHasMore: false });
		setBlocks({
			openSearch: false,
			openPopular: true,
			openEpisodes: false,
		});
		handleGetPopular();
	}

	function handleShowAllBlock() {
		history.push("/tv/all");

		setEpisodes([]);
		setPagination({ ...pagination, allPage: 0, allHasMore: false });
		setBlocks({
			openSearch: false,
			openPopular: false,
			openEpisodes: true,
		});
		handleGetAll();
	}

	function handleShowModal(e, type) {
		console.log(e.target.id);
		if (type === "edit") {
			setSelectedSeries(subscriptions.find(s => s.externalId === e.target.id));
		} else {
			let found = popular.find(s => s.externalId.toString() === e.target.id);
			if (!found) found = popular.find(s => s.externalId.toString() === e.target.id);

			setSelectedSeries(found);
		}

		setOpenModal(true);
	}

	function handleHideModal() {
		setOpenModal(false);
	}

	function filterEpisodes(filter) {
		setEpisodes([]);
		setPagination({ ...pagination, episodeFilter: filter });

		handleShowAllBlock();
	}

	useEffect(() => {
		switch (match.path) {
			case "/tv":
				history.replace("/tv/all");
				break;
			case "/tv/all":
				handleShowAllBlock();
				break;
			case "/tv/popular":
				handleShowPopularBlock();
				break;
			case "/tv/:seriesId":
				handleGetInfo(match.params.seriesId);
				break;
			case "/tv/:seriesId/:season":
				handleGetInfo(match.params.seriesId, Number(match.params.season));
				break;
			default:
				break;
		}
	}, [match.url]); // eslint-disable-line

	useEffect(() => {
		if (seasons.length) {
			if (match.params.seriesId === currentSeries && match.params.season) {
				// url set on mount
				handleGetEpisodes(match.params.season);
			} else {
				// changed series
				updateUrlFilter(currentSeries, seasons[seasons.length - 1]._id);
			}
		}
	}, [seasons]); // eslint-disable-line

	function renderButtons() {
		return (
			<div align="center">
				<Fab onClick={handleShowSearchBlock} variant="extended" size="medium" className={classes.searchBtn}>
					<i className="material-icons">{"search"}</i>
					{"Search"}
				</Fab>
				<Button
					onClick={handleShowPopularBlock}
					className={classes.outlinedBtn}
					color="primary"
					variant="outlined"
					fullWidth
				>
					{loadingPopular ? <img src={loadingGif} height="25px" alt="Loading..." /> : "Popular"}
				</Button>
				<Button
					onClick={handleShowAllBlock}
					className={classes.outlinedBtn}
					color="primary"
					variant="outlined"
					fullWidth
				>
					{loadingAll ? <img src={loadingGif} height="25px" alt="Loading..." /> : "All"}
				</Button>
			</div>
		);
	}

	function renderContent() {
		if (blocks.openSearch) {
			return <Search allSeries={subscriptions} />;
		} else if (blocks.openPopular) {
			return <Banners series={popular} getMore={handleGetPopular} hasMore={pagination.popularHasMore} />;
		} else if (blocks.openEpisodes) {
			return (
				<Episodes
					currentSeries={currentSeries}
					seasons={seasons}
					episodes={episodes}
					selectedSeason={Number(match.params.season)}
					getEpisodes={handleSeasonChange}
					getAll={handleGetAll}
					allHasMore={pagination.allHasMore}
					filterEpisodes={filterEpisodes}
				/>
			);
		}

		return <div />;
	}

	const menuOptions = [
		{ displayName: "Edit", onClick: e => handleShowModal(e, "edit") },
		{ displayName: "Delete", onClick: handleDeleteSeries },
	];

	console.log(selectedSeries);

	return (
		<Grid container spacing={2}>
			<Grid item sm={3} md={2}>
				{renderButtons()}
				<Sidebar
					options={subscriptions}
					idField="externalId"
					action={handleGetInfo}
					menu={menuOptions}
					loading={loadingSeries}
					noResultsMessage={"No series"}
					selected={match.params.seriesId}
				/>
			</Grid>
			<Grid item sm={9} md={10} lg={10}>
				{renderContent()}
			</Grid>
			<SeriesDetail
				open={openModal}
				series={selectedSeries}
				editSeries={handleEditSeries}
				onClose={handleHideModal}
			/>
		</Grid>
	);
}

export default TV;
