import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";

import Zoom from "@material-ui/core/Zoom";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

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
	},
	cell: {
		padding: 2,
	},
	single: {
		height: "100%",
		boxSizing: "border-box",
		backgroundColor: "#212121",
		padding: 16,
	},
	headersingle: {
		paddingBottom: 5,
		borderBottom: "1px solid #424242",
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
		}
		return `${number.toFixed(2)} ${prefix}`;
	}

	renderPercentages(variant, percentage) {
		const { classes } = this.props;
		return (
			<Typography variant={variant} className={percentage > 0 ? classes.green : classes.red}>
				{`${percentage.toFixed(2)}%`}
			</Typography>
		);
	}

	render() {
		const { classes } = this.props;
		const { loaded, cryptos } = this.state;

		if (loaded) {
			if (cryptos.length) {
				return (
					<Zoom in={loaded}>
						<TableContainer component={Paper} className={classes.root}>
							<Table>
								<TableBody>
									{cryptos.map(crypto => (
										<TableRow key={crypto.rank}>
											<TableCell className={classes.cell}>
												<Box display="flex" flexDirection="column">
													<Typography variant="subtitle2">{crypto.symbol}</Typography>
													<Typography variant="caption">{crypto.name}</Typography>
												</Box>
											</TableCell>
											<TableCell className={classes.cell} align="right">
												<Typography variant="caption">{`€${crypto.price.toFixed(2)}`}</Typography>
											</TableCell>
											<TableCell className={classes.cell}>
												<Box display="flex" flexDirection="column" alignItems="flex-end">
													<Typography variant="caption">{`€${this.simplifyNumber(crypto.marketCap)}`}</Typography>
													<Typography variant="caption">{`€${this.simplifyNumber(crypto.volume)}`}</Typography>
												</Box>
											</TableCell>
											<TableCell className={classes.cell}>
												<Box display="flex" flexDirection="column" alignItems="flex-end">
													{this.renderPercentages("caption", crypto.change1h)}
													{this.renderPercentages("caption", crypto.change24h)}
													{this.renderPercentages("caption", crypto.change7d)}
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

			return (
				<Zoom in={loaded}>
					<Box component={Paper} display="flex" flexDirection="column" className={classes.single}>
						<Box display="flex" flexDirection="column" className={classes.headersingle}>
							<Typography variant="h5">{cryptos.symbol}</Typography>
							<Typography variant="subtitle1">{cryptos.name}</Typography>
						</Box>
						<Box display="flex" flexGrow={1} justifyContent="center">
							<Box display="flex" flexDirection="column" flex="1" justifyContent="center" alignItems="center">
								<Typography align="center" variant="caption">{"Market Cap"}</Typography>
								<Typography variant="subtitle1">{`€${this.simplifyNumber(cryptos.marketCap)}`}</Typography>
							</Box>
							<Box display="flex" flexDirection="column" flex="1" justifyContent="center" alignItems="center">
								<Typography align="center" variant="caption">{"Volume (24h)"}</Typography>
								<Typography variant="subtitle1">{`€${this.simplifyNumber(cryptos.volume)}`}</Typography>
							</Box>
							<Box display="flex" flexDirection="column" flex="1" justifyContent="center" alignItems="center">
								<Typography align="center" variant="caption">{"Circulating Supply"}</Typography>
								<Typography variant="subtitle1">{`${this.simplifyNumber(cryptos.circulatingSupply)}`}</Typography>
							</Box>
						</Box>
						<Box display="flex" flexGrow={1}>
							<Box display="flex" flexDirection="column" flex="1" justifyContent="center" alignItems="center">
								<Typography variant="caption">{"% 1h"}</Typography>
								{this.renderPercentages("subtitle1", cryptos.change1h)}
							</Box>
							<Box display="flex" flexDirection="column" flex="1" justifyContent="center" alignItems="center">
								<Typography variant="caption">{"% 24h"}</Typography>
								{this.renderPercentages("subtitle1", cryptos.change24h)}
							</Box>
							<Box display="flex" flexDirection="column" flex="1" justifyContent="center" alignItems="center">
								<Typography variant="caption">{"% 7d"}</Typography>
								{this.renderPercentages("subtitle1", cryptos.change7d)}
							</Box>
						</Box>
					</Box>
				</Zoom>
			);
		}
		return null;
	}
}

CryptoWidget.propTypes = {
	classes: PropTypes.object.isRequired,
	coins: PropTypes.string.isRequired,
};

export default withStyles(styles)(CryptoWidget);
