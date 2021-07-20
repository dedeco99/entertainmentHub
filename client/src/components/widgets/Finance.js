import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import {
	makeStyles,
	Zoom,
	Box,
	Typography,
	Tooltip,
	Table,
	TableContainer,
	TableBody,
	TableRow,
	TableCell,
	Avatar,
} from "@material-ui/core";

import Loading from "../.partials/Loading";

import { getCryptoPrices, getStockPrices } from "../../api/finance";

import { finance as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function Finance({ coins, stocks, widgetDimensions }) {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [crypto, setCrypto] = useState([]);
	const [showListView, setShowListView] = useState(true);
	const [selectedTicker, setSelectedTicker] = useState(0);
	const [rerender, setRerender] = useState(false);

	useEffect(() => {
		let isMounted = true;

		async function fetchData() {
			setOpen(false);

			const cryptoResponse = coins ? await getCryptoPrices(coins) : { data: [] };
			const stockResponse = stocks ? await getStockPrices(stocks) : { data: [] };
			const response = cryptoResponse.data.concat(stockResponse.data);

			if (isMounted) {
				setCrypto(response.sort((a, b) => (a.marketCap - b.marketCap ? -1 : 1)));
				setShowListView(response.length > 1);
				setOpen(true);
			}
		}

		fetchData();

		return () => (isMounted = false);
	}, [coins, stocks]);

	function simplifyNumber(num) {
		if (num) {
			let number = num;
			let prefix = "";
			if (number >= 1000000000000) {
				number /= 1000000000000;
				prefix = "T";
			} else if (number >= 1000000000) {
				number /= 1000000000;
				prefix = "B";
			} else if (number >= 1000000) {
				number /= 1000000;
				prefix = "M";
			} else if (number >= 10000) {
				number /= 10000;
				prefix = "k";
			}
			return `${number.toFixed(2)} ${prefix}`;
		}

		return "--";
	}

	function handleCheckTicker(position) {
		setShowListView(false);
		setSelectedTicker(position);
	}

	function handleCheckList() {
		setShowListView(true);
	}

	function renderPrice(price) {
		return `€${Math.floor(price) === 0 ? price.toFixed(3) : price.toFixed(2)}`;
	}

	function renderPercentages(variant, percentage) {
		return (
			<Typography variant={variant} className={percentage >= 0 ? classes.green : classes.red}>
				{`${percentage ? percentage.toFixed(1) : 0}%`}
			</Typography>
		);
	}

	function render1x1(ticker) {
		return (
			<Box display="flex" flexDirection="column" alignItems="center">
				<Box display="flex" alignItems="center" mb={1}>
					{ticker.image ? (
						<img
							src={ticker.image}
							alt="icon-crypto"
							onError={() => {
								ticker.image = null;
								setRerender(!rerender);
							}}
						/>
					) : (
						<Avatar style={{ width: 80, height: 80, fontSize: 40 }}>{ticker.symbol[0]}</Avatar>
					)}
				</Box>
				<Box display="flex" alignItems="center">
					<Typography variant="h6">{renderPrice(ticker.price)}</Typography>
				</Box>
				<Box>
					<Tooltip title="% 1h" style={{ marginRight: 10 }}>
						{renderPercentages("caption", ticker.change1h)}
					</Tooltip>
					<Tooltip title="% 24h" style={{ marginRight: 10 }}>
						{renderPercentages("caption", ticker.change24h)}
					</Tooltip>
					<Tooltip title="% 7d">{renderPercentages("caption", ticker.change7d)}</Tooltip>
				</Box>
			</Box>
		);
	}

	function renderSingleView(ticker) {
		return (
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="center"
				className={classes.singleRoot}
				onClick={crypto.length && handleCheckList}
			>
				<Box display="flex" alignItems="center" className={classes.singleHeader}>
					<Box display="flex">
						{ticker.image ? (
							<img
								src={ticker.image}
								alt="icon-crypto"
								className={classes.singleImage}
								onError={() => {
									ticker.image = null;
									setRerender(!rerender);
								}}
							/>
						) : (
							<Avatar style={{ marginRight: 10 }}>{ticker.symbol[0]}</Avatar>
						)}
					</Box>
					<Box display="flex" flexGrow={1} flexDirection="column">
						<Typography variant="h5">{ticker.symbol}</Typography>
						<Typography variant="subtitle1">{ticker.name}</Typography>
					</Box>
					<Box display="flex">
						<Typography variant="h6">{renderPrice(ticker.price)}</Typography>
					</Box>
				</Box>
				<Box
					display="flex"
					flexDirection="column"
					flex="1"
					justifyContent="center"
					className={classes.singleContent}
				>
					<Box display="flex" flex="1">
						<Box display="flex" flexGrow={1} flexDirection="column" justifyContent="center">
							<Typography variant="caption">{"Market Cap"}</Typography>
							<Typography variant="subtitle1">{`${simplifyNumber(ticker.marketCap)}`}</Typography>
						</Box>
						<Box
							display="flex"
							flexDirection="column"
							justifyContent="center"
							alignItems="center"
							className={classes.singlePercentage}
						>
							<Typography variant="caption">{"% 1h"}</Typography>
							{renderPercentages("subtitle1", ticker.change1h)}
						</Box>
					</Box>
					<Box display="flex" flex="1">
						<Box display="flex" flexGrow={1} flexDirection="column" justifyContent="center">
							<Typography variant="caption">{"Volume (24h)"}</Typography>
							<Typography variant="subtitle1">{`${simplifyNumber(ticker.volume)}`}</Typography>
						</Box>
						<Box
							display="flex"
							flexDirection="column"
							justifyContent="center"
							alignItems="center"
							className={classes.singlePercentage}
						>
							<Typography variant="caption">{"% 24h"}</Typography>
							{renderPercentages("subtitle1", ticker.change24h)}
						</Box>
					</Box>
					<Box display="flex" flex="1">
						<Box display="flex" flexGrow={1} flexDirection="column" justifyContent="center">
							<Typography variant="caption">{"Circulating Supply"}</Typography>
							<Typography variant="subtitle1">
								{`${simplifyNumber(ticker.circulatingSupply).substr(1)} ${ticker.symbol}`}
							</Typography>
						</Box>
						<Box
							display="flex"
							flexDirection="column"
							justifyContent="center"
							alignItems="center"
							className={classes.singlePercentage}
						>
							<Typography variant="caption">{"% 7d"}</Typography>
							{renderPercentages("subtitle1", ticker.change7d)}
						</Box>
					</Box>
				</Box>
			</Box>
		);
	}

	function renderListView() {
		return (
			<TableContainer className={classes.root}>
				<Table>
					<TableBody>
						{crypto.map((c, index) => (
							<TableRow key={c.rank} onClick={() => handleCheckTicker(index)}>
								<TableCell className={classes.cell}>
									{c.image ? (
										<img
											src={c.image}
											alt="icon-crypto"
											className={classes.listImage}
											onError={() => {
												c.image = null;
												setRerender(!rerender);
											}}
										/>
									) : (
										<Avatar className={classes.listImage}>{c.symbol[0]}</Avatar>
									)}
								</TableCell>
								<TableCell className={`${classes.cell} ${classes.nameCell}`}>
									<Box display="flex" flexDirection="column">
										<Typography variant="subtitle2">{c.symbol}</Typography>
										<Typography variant="caption">{c.name}</Typography>
									</Box>
								</TableCell>
								<TableCell className={classes.cell} align="right">
									<Tooltip title="Price" placement="left">
										<Typography variant="caption">{renderPrice(c.price)}</Typography>
									</Tooltip>
								</TableCell>
								<TableCell className={classes.cell}>
									<Box display="flex" flexDirection="column" alignItems="flex-end">
										<Tooltip title="Market Cap" placement="left">
											<Typography variant="caption">{`€${simplifyNumber(c.marketCap)}`}</Typography>
										</Tooltip>
										<Tooltip title="Volume" placement="left">
											<Typography variant="caption">{`€${simplifyNumber(c.volume)}`}</Typography>
										</Tooltip>
									</Box>
								</TableCell>
								<TableCell className={classes.cell}>
									<Box display="flex" flexDirection="column" alignItems="flex-end">
										<Tooltip title="% 1h" placement="left">
											{renderPercentages("caption", c.change1h)}
										</Tooltip>
										<Tooltip title="% 24h" placement="left">
											{renderPercentages("caption", c.change24h)}
										</Tooltip>
										<Tooltip title="% 7d" placement="left">
											{renderPercentages("caption", c.change7d)}
										</Tooltip>
										<Tooltip title="% 30d" placement="left">
											{renderPercentages("caption", c.change30d)}
										</Tooltip>
									</Box>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		);
	}

	function renderType() {
		if (
			(widgetDimensions.h >= 1 && widgetDimensions.w === 1) ||
			(widgetDimensions.h === 1 && widgetDimensions.w === 2)
		) {
			return render1x1(crypto[selectedTicker]);
		} else if (showListView) {
			return renderListView();
		}

		return renderSingleView(crypto[selectedTicker]);
	}

	if (!open) return <Loading />;

	return <Zoom in={open}>{renderType()}</Zoom>;
}

Finance.propTypes = {
	coins: PropTypes.string.isRequired,
	stocks: PropTypes.string.isRequired,
	widgetDimensions: PropTypes.object,
};

export default Finance;
