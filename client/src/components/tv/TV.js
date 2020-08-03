import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { makeStyles, Grid, Fab, Button } from "@material-ui/core";

import Sidebar from "../.partials/Sidebar";
import SeriesDetail from "./SeriesDetail";
import Episodes from "./Episodes";
import Search from "./Search";
import Banners from "./Banners";

import { getSeries, getSeasons, getPopular, addSeries, editSeries, deleteSeries } from "../../api/tv";

import loadingGif from "../../img/loading3.gif";

import { tv as styles } from "../../styles/TV";

const useStyles = makeStyles(styles);

function TV() {
	const history = useHistory();
	const match = useRouteMatch();
	const classes = useStyles();
	const [series, setSeries] = useState([]);
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

			const response = await getSeries();

			setSeries(response.data);
			setLoadingSeries(false);
		}

		fetchData();
	}, []);

	function updateUrlFilter(seriesId, season) {
		if (seriesId) {
			if (season >= 0) {
				history.push(`/tv/${seriesId}/${season}`);
			} else {
				history.push(`/tv/${seriesId}`);
			}
		}
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

	async function handleGetSeasons(id, season) {
		const seriesFound = series.find(s => s._id === id);
		const seriesId = seriesFound ? seriesFound.seriesId : id;

		const response = await getSeasons(seriesId);

		if (response.status === 200) {
			updateUrlFilter(seriesId, season || response.data[response.data.length - 1]._id);

			setCurrentSeries(seriesId);
			setSeasons(response.data);
			setPagination({ ...pagination, allPage: 0 });
		}
	}

	function handleGetEpisodes(season) {
		const foundSeason = seasons.find(s => s._id === Number(season));

		if (foundSeason) {
			const seriesFound = series.find(s => s.seriesId === currentSeries);
			updateUrlFilter(seriesFound.seriesId, season);

			setEpisodes(foundSeason.episodes);
			setBlocks({
				openSearch: false,
				openPopular: false,
				openEpisodes: true,
			});
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

	async function handleAddSeries(show) {
		const response = await addSeries(show);

		if (response.status === 201) {
			setSeries([...series, response.data].sort((a, b) => (a.displayName <= b.displayName ? -1 : 1)));
		}
	}

	async function handleEditSeries(id, show) {
		const response = await editSeries(id, show);

		if (response.status === 200) {
			setSeries(
				[...series.filter(s => s._id !== response.data._id), response.data].sort((a, b) =>
					a.displayName <= b.displayName ? -1 : 1,
				),
			);
		}
	}

	async function handleDeleteSeries(e) {
		const response = await deleteSeries(e.target.id);

		if (response.status === 200) {
			const updatedSeries = series.filter(s => s._id !== response.data._id);

			setSeries(updatedSeries);
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
		if (type === "edit") {
			setSelectedSeries(series.find(s => s._id === e.target.id));
		} else {
			let found = popular.find(s => s.id.toString() === e.target.id);
			if (!found) found = popular.find(s => s.id.toString() === e.target.id);

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
			case "/tv/all":
				handleShowAllBlock();
				break;
			case "/tv/popular":
				handleShowPopularBlock();
				break;
			case "/tv/:seriesId":
				handleGetSeasons(match.params.seriesId);
				break;
			case "/tv/:seriesId/:season":
				handleGetSeasons(match.params.seriesId, Number(match.params.season));
				break;
			default:
				break;
		}
	}, [match.path]); // eslint-disable-line

	useEffect(() => {
		if (seasons.length) {
			handleGetEpisodes(match.params.season);
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
			return <Search allSeries={series} addSeries={handleAddSeries} />;
		} else if (blocks.openPopular) {
			return (
				<Banners
					series={popular}
					getMore={handleGetPopular}
					hasMore={pagination.popularHasMore}
					allSeries={series}
					addSeries={handleAddSeries}
				/>
			);
		} else if (blocks.openEpisodes) {
			return (
				<Episodes
					currentSeries={currentSeries}
					seasons={seasons}
					episodes={episodes}
					selectedSeason={Number(match.params.season)}
					getEpisodes={handleGetEpisodes}
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

	return (
		<Grid container spacing={2}>
			<Grid item sm={3} md={2}>
				{renderButtons()}
				<Sidebar
					options={series}
					idField="_id"
					action={handleGetSeasons}
					menu={menuOptions}
					loading={loadingSeries}
					noResultsMessage={"No series"}
					initialSelected={match.params.seriesId}
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
