import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";

import Zoom from "@material-ui/core/Zoom";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip"

import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

import { getCrypto } from "../../api/crypto";

const styles = () => ({
	root: {
		height: "100%",
		boxSizing: "border-box",
		overflow: "auto",
		padding: 10,
		backgroundColor: "#212121",
		border: "1px solid #424242",
	},
	cell: {
		padding: 2,
	},
	nameCell: {
		maxWidth: 60,
	},
	listImage: {
		height: 16,
		width: 16,
		padding: 5,
	},
	singleRoot: {
		height: "100%",
		boxSizing: "border-box",
		backgroundColor: "#212121",
		padding: 16,
		border: "1px solid #424242",
	},
	singleContent: {
		paddingTop: 15,
		paddingBottom: 15,
		borderTop: "1px solid #424242",
	},
	singleHeader: {
		paddingBottom: 5,
	},
	singlePercentage: {
		width: 70,
		padding: 5,
		borderLeft: "1px solid #424242",
	},
	singleImage: {
		padding: 10,
		height: 36,
		width: 36,
	},
	green: {
		color: "#43a047 !important",
	},
	red: {
		color: "#f4511e !important",
	},
});

class CryptoWidget extends Component {
	constructor() {
		super();
		this.state = {
			loaded: false,
			cryptos: [],
		};
	}

	async componentDidMount() {
		const { coins } = this.props;

		const response = await getCrypto(coins);

		this.setState({
			loaded: true,
			cryptos: response.data,
		});
	}

	simplifyNumber(number) {
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

	formatNumber(number) {
		return new Intl.NumberFormat(undefined, {
			style: "currency",
			currency: "EUR",
		}).format(Math.floor(number)).slice(0, -3);
	}

	renderPrice(price) {
		price = Math.floor(price) === 0 ? price.toFixed(3) : price.toFixed(2);
		return `€${price}`;
	}

	renderPercentages(variant, percentage) {
		const { classes } = this.props;
		return (
			<Typography variant={variant} className={percentage > 0 ? classes.green : classes.red}>
				{`${percentage.toFixed(2)}%`}
			</Typography>
		);
	}

	renderSingleView() {
		const { classes } = this.props;
		const { loaded, cryptos } = this.state;

		return (
			<Zoom in={loaded}>
				<Box component={Paper} display="flex" flexDirection="column" className={classes.singleRoot}>
					<Box display="flex" alignItems="center" className={classes.singleHeader}>
						<Box display="flex">
							<img src={cryptos.image} alt="icon-crypto" className={classes.singleImage}/>
						</Box>
						<Box display="flex" flexGrow={1} flexDirection="column">
							<Typography variant="h5">{cryptos.symbol}</Typography>
							<Typography variant="subtitle1">{cryptos.name}</Typography>
						</Box>
						<Box display="flex">
							<Typography variant="h6">{this.renderPrice(cryptos.price)}</Typography>
						</Box>
					</Box>
					<Box display="flex" flexDirection="column" flex="1" justifyContent="center" className={classes.singleContent}>
						<Box display="flex" flex="1">
							<Box display="flex" flexGrow={1} flexDirection="column" justifyContent="center">
								<Typography variant="caption">{"Market Cap"}</Typography>
								<Typography variant="subtitle1">{`${this.formatNumber(cryptos.marketCap)}`}</Typography>
							</Box>
							<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" className={classes.singlePercentage}>
								<Typography variant="caption">{"% 1h"}</Typography>
								{this.renderPercentages("subtitle1", cryptos.change1h)}
							</Box>
						</Box>
						<Box display="flex" flex="1">
							<Box display="flex" flexGrow={1} flexDirection="column" justifyContent="center">
								<Typography variant="caption">{"Volume (24h)"}</Typography>
								<Typography variant="subtitle1">{`${this.formatNumber(cryptos.volume)}`}</Typography>
							</Box>
							<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" className={classes.singlePercentage}>
								<Typography variant="caption">{"% 24h"}</Typography>
								{this.renderPercentages("subtitle1", cryptos.change24h)}
							</Box>
						</Box>
						<Box display="flex" flex="1">
							<Box display="flex" flexGrow={1} flexDirection="column" justifyContent="center">
								<Typography variant="caption">{"Circulating Supply"}</Typography>
								<Typography variant="subtitle1">{`${this.formatNumber(cryptos.circulatingSupply).substr(1)} ${cryptos.symbol}`}</Typography>
							</Box>
							<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" className={classes.singlePercentage}>
								<Typography variant="caption">{"% 7d"}</Typography>
								{this.renderPercentages("subtitle1", cryptos.change7d)}
							</Box>
						</Box>
					</Box>
				</Box>
			</Zoom>
		);
	}

	renderListView() {
		const { classes } = this.props;
		const { loaded, cryptos } = this.state;

		return (
			<Zoom in={loaded}>
				<TableContainer component={Paper} className={classes.root}>
					<Table>
						<TableBody>
							{cryptos.map(crypto => (
								<TableRow key={crypto.rank}>
									<TableCell className={classes.cell}>
										<img src={crypto.image} alt="icon-crypto" className={classes.listImage} />
									</TableCell>
									<TableCell className={`${classes.cell} ${classes.nameCell}`}>
										<Box display="flex" flexDirection="column">
											<Typography variant="subtitle2">{crypto.symbol}</Typography>
											<Typography variant="caption">{crypto.name}</Typography>
										</Box>
									</TableCell>
									<TableCell className={classes.cell} align="right">
										<Tooltip title="Price" placement="left">
											<Typography variant="caption">{this.renderPrice(crypto.price)}</Typography>
										</Tooltip>
									</TableCell>
									<TableCell className={classes.cell}>
										<Box display="flex" flexDirection="column" alignItems="flex-end">
											<Tooltip title="Market Cap" placement="left">
												<Typography variant="caption">{`€${this.simplifyNumber(crypto.marketCap)}`}</Typography>
											</Tooltip>
											<Tooltip title="Volume" placement="left">
												<Typography variant="caption">{`€${this.simplifyNumber(crypto.volume)}`}</Typography>
											</Tooltip>
										</Box>
									</TableCell>
									<TableCell className={classes.cell}>
										<Box display="flex" flexDirection="column" alignItems="flex-end">
											<Tooltip title="% 1h" placement="left">
												{this.renderPercentages("caption", crypto.change1h)}
											</Tooltip>
											<Tooltip title="% 24h" placement="left">
												{this.renderPercentages("caption", crypto.change24h)}
											</Tooltip>
											<Tooltip title="% 7d" placement="left">
												{this.renderPercentages("caption", crypto.change7d)}
											</Tooltip>
										</Box>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Zoom>
		);
	}

	render() {
		const { loaded, cryptos } = this.state;

		if (loaded) {
			if (cryptos.length) {
				return this.renderListView();
			}

			return this.renderSingleView();
		}
		return null;
	}
}

CryptoWidget.propTypes = {
	classes: PropTypes.object.isRequired,
	coins: PropTypes.string.isRequired,
};

export default withStyles(styles)(CryptoWidget);
