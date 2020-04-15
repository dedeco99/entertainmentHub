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
		const response = await getCrypto("ETH,BTC");

		this.setState({
			loaded: true,
			cryptos: response.data,
		});
	}

	simplifyNumber(number) {
		console.log("number", number);
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

	render() {
		const { classes } = this.props;
		const { loaded, cryptos } = this.state;

		if (loaded) {
			console.log(cryptos);

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
													<Typography variant="caption">{`${crypto.change1h.toFixed(2)}%`}</Typography>
													<Typography variant="caption">{`${crypto.change24h.toFixed(2)}%`}</Typography>
													<Typography variant="caption">{`${crypto.change7d.toFixed(2)}%`}</Typography>
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
		}
		return null;
	}
}

CryptoWidget.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CryptoWidget);
