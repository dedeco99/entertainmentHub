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
} from "@material-ui/core";

import Loading from "../.partials/Loading";

import { getCrypto } from "../../api/crypto";

import { crypto as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function Crypto({ coins, widgetDimensions }) {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [crypto, setCrypto] = useState([]);
	const [showListView, setShowListView] = useState(true);
	const [selectedCoin, setSelectedCoin] = useState(0);

	useEffect(() => {
		async function fetchData() {
			setOpen(false);

			const response = await getCrypto(coins);

			setCrypto(response.data);
			setShowListView(response.data.length > 1);
			setOpen(true);
		}

		fetchData();
	}, [coins]); // eslint-disable-line

	function simplifyNumber(num) {
		if (num) {
			let number = num;
			let prefix = "";
			if (number >= 1000000000) {
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

	function handleCheckCoin(position) {
		setShowListView(false);
		setSelectedCoin(position);
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
				{`${percentage ? percentage.toFixed(2) : 0}%`}
			</Typography>
		);
	}

	function render1x1(coin) {
		return (
			<Box display="flex" flexDirection="column" alignItems="center">
				<Box display="flex" alignItems="center" mb={1}>
					<img src={coin.image} alt="icon-crypto" />
				</Box>
				<Box display="flex" alignItems="center">
					<Typography variant="h6">{renderPrice(coin.price)}</Typography>
				</Box>
			</Box>
		);
	}

	function renderSingleView(coin) {
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
						<img src={coin.image} alt="icon-crypto" className={classes.singleImage} />
					</Box>
					<Box display="flex" flexGrow={1} flexDirection="column">
						<Typography variant="h5">{coin.symbol}</Typography>
						<Typography variant="subtitle1">{coin.name}</Typography>
					</Box>
					<Box display="flex">
						<Typography variant="h6">{renderPrice(coin.price)}</Typography>
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
							<Typography variant="subtitle1">{`${simplifyNumber(coin.marketCap)}`}</Typography>
						</Box>
						<Box
							display="flex"
							flexDirection="column"
							justifyContent="center"
							alignItems="center"
							className={classes.singlePercentage}
						>
							<Typography variant="caption">{"% 1h"}</Typography>
							{renderPercentages("subtitle1", coin.change1h)}
						</Box>
					</Box>
					<Box display="flex" flex="1">
						<Box display="flex" flexGrow={1} flexDirection="column" justifyContent="center">
							<Typography variant="caption">{"Volume (24h)"}</Typography>
							<Typography variant="subtitle1">{`${simplifyNumber(coin.volume)}`}</Typography>
						</Box>
						<Box
							display="flex"
							flexDirection="column"
							justifyContent="center"
							alignItems="center"
							className={classes.singlePercentage}
						>
							<Typography variant="caption">{"% 24h"}</Typography>
							{renderPercentages("subtitle1", coin.change24h)}
						</Box>
					</Box>
					<Box display="flex" flex="1">
						<Box display="flex" flexGrow={1} flexDirection="column" justifyContent="center">
							<Typography variant="caption">{"Circulating Supply"}</Typography>
							<Typography variant="subtitle1">
								{`${simplifyNumber(coin.circulatingSupply).substr(1)} ${coin.symbol}`}
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
							{renderPercentages("subtitle1", coin.change7d)}
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
							<TableRow key={c.rank} onClick={() => handleCheckCoin(index)}>
								<TableCell className={classes.cell}>
									<img src={c.image} alt="icon-crypto" className={classes.listImage} />
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
		if (widgetDimensions.h === 1 && widgetDimensions.w === 1) {
			return render1x1(crypto[selectedCoin]);
		} else if (showListView) {
			return renderListView();
		}

		return renderSingleView(crypto[selectedCoin]);
	}

	if (!open) return <Loading />;

	return <Zoom in={open}>{renderType()}</Zoom>;
}

Crypto.propTypes = {
	coins: PropTypes.string.isRequired,
	widgetDimensions: PropTypes.object,
};

export default Crypto;
