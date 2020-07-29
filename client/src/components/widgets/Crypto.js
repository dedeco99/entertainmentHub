import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";

import Zoom from "@material-ui/core/Zoom";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

import Loading from "../.partials/Loading";

import { getCrypto } from "../../api/crypto";

import { crypto as styles } from "../../styles/Widgets";

class Crypto extends Component {
	constructor() {
		super();
		this.state = {
			open: false,
			crypto: [],
			showListView: true,
			selectedCoin: 0,
		};

		this.handleCheckCoin = this.handleCheckCoin.bind(this);
		this.handleCheckList = this.handleCheckList.bind(this);
	}

	async componentDidMount() {
		const { coins } = this.props;

		await this.getCrypto(coins);
	}

	async getCrypto(coins) {
		const response = await getCrypto(coins);

		this.setState({ open: true, crypto: response.data, showListView: response.data.length > 1 });
	}

	simplifyNumber(num) {
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

	handleCheckCoin(position) {
		this.setState({ showListView: false, selectedCoin: position });
	}

	handleCheckList() {
		this.setState({ showListView: true });
	}

	renderPrice(price) {
		return `€${Math.floor(price) === 0 ? price.toFixed(3) : price.toFixed(2)}`;
	}

	renderPercentages(variant, percentage) {
		const { classes } = this.props;
		return (
			<Typography variant={variant} className={percentage >= 0 ? classes.green : classes.red}>
				{`${percentage ? percentage.toFixed(2) : 0}%`}
			</Typography>
		);
	}

	render1x1(coin) {
		return (
			<Box display="flex" flexDirection="column" alignItems="center">
				<Box display="flex" alignItems="center" mb={1}>
					<img src={coin.image} alt="icon-crypto" />
				</Box>
				<Box display="flex" alignItems="center">
					<Typography variant="h6">{this.renderPrice(coin.price)}</Typography>
				</Box>
			</Box>
		);
	}

	renderSingleView(coin) {
		const { classes } = this.props;
		const { crypto } = this.state;

		return (
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="center"
				className={classes.singleRoot}
				onClick={crypto.length && this.handleCheckList}
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
						<Typography variant="h6">{this.renderPrice(coin.price)}</Typography>
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
							<Typography variant="subtitle1">{`${this.simplifyNumber(coin.marketCap)}`}</Typography>
						</Box>
						<Box
							display="flex"
							flexDirection="column"
							justifyContent="center"
							alignItems="center"
							className={classes.singlePercentage}
						>
							<Typography variant="caption">{"% 1h"}</Typography>
							{this.renderPercentages("subtitle1", coin.change1h)}
						</Box>
					</Box>
					<Box display="flex" flex="1">
						<Box display="flex" flexGrow={1} flexDirection="column" justifyContent="center">
							<Typography variant="caption">{"Volume (24h)"}</Typography>
							<Typography variant="subtitle1">{`${this.simplifyNumber(coin.volume)}`}</Typography>
						</Box>
						<Box
							display="flex"
							flexDirection="column"
							justifyContent="center"
							alignItems="center"
							className={classes.singlePercentage}
						>
							<Typography variant="caption">{"% 24h"}</Typography>
							{this.renderPercentages("subtitle1", coin.change24h)}
						</Box>
					</Box>
					<Box display="flex" flex="1">
						<Box display="flex" flexGrow={1} flexDirection="column" justifyContent="center">
							<Typography variant="caption">{"Circulating Supply"}</Typography>
							<Typography variant="subtitle1">
								{`${this.simplifyNumber(coin.circulatingSupply).substr(1)} ${coin.symbol}`}
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
							{this.renderPercentages("subtitle1", coin.change7d)}
						</Box>
					</Box>
				</Box>
			</Box>
		);
	}

	renderListView() {
		const { classes } = this.props;
		const { crypto } = this.state;

		return (
			<TableContainer className={classes.root}>
				<Table>
					<TableBody>
						{crypto.map((c, index) => (
							<TableRow key={c.rank} onClick={() => this.handleCheckCoin(index)}>
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
										<Typography variant="caption">{this.renderPrice(c.price)}</Typography>
									</Tooltip>
								</TableCell>
								<TableCell className={classes.cell}>
									<Box display="flex" flexDirection="column" alignItems="flex-end">
										<Tooltip title="Market Cap" placement="left">
											<Typography variant="caption">{`€${this.simplifyNumber(c.marketCap)}`}</Typography>
										</Tooltip>
										<Tooltip title="Volume" placement="left">
											<Typography variant="caption">{`€${this.simplifyNumber(c.volume)}`}</Typography>
										</Tooltip>
									</Box>
								</TableCell>
								<TableCell className={classes.cell}>
									<Box display="flex" flexDirection="column" alignItems="flex-end">
										<Tooltip title="% 1h" placement="left">
											{this.renderPercentages("caption", c.change1h)}
										</Tooltip>
										<Tooltip title="% 24h" placement="left">
											{this.renderPercentages("caption", c.change24h)}
										</Tooltip>
										<Tooltip title="% 7d" placement="left">
											{this.renderPercentages("caption", c.change7d)}
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

	renderType() {
		const { widgetDimensions } = this.props;
		const { crypto, selectedCoin, showListView } = this.state;

		if (widgetDimensions.h === 1 && widgetDimensions.w === 1) {
			return this.render1x1(crypto[selectedCoin]);
		} else if (showListView) {
			return this.renderListView();
		}

		return this.renderSingleView(crypto[selectedCoin]);
	}

	render() {
		const { open } = this.state;

		if (!open) return <Loading />;

		return <Zoom in={open}>{this.renderType()}</Zoom>;
	}
}

Crypto.propTypes = {
	classes: PropTypes.object.isRequired,
	coins: PropTypes.string.isRequired,
	widgetDimensions: PropTypes.object.isRequired,
};

export default withStyles(styles)(Crypto);
