import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import Zoom from "@material-ui/core/Zoom";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

import { getCrypto } from "../../api/crypto";

import { crypto as styles } from "../../styles/Widgets";

class Crypto extends Component {
	constructor() {
		super();
		this.state = {
			loaded: false,
			crypto: [],
		};
	}

	async componentDidMount() {
		const { coins } = this.props;

		await this.getCrypto(coins);
	}

	async getCrypto(coins) {
		const response = await getCrypto(coins);

		this.setState({ loaded: true, crypto: response.data });
	}

	simplifyNumber(num) {
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

	formatNumber(number) {
		return new Intl.NumberFormat(null, {
			style: "currency",
			currency: "EUR",
		}).format(Math.floor(number)).slice(0, -3);
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

	renderSingleView() {
		const { classes } = this.props;
		const { loaded, crypto } = this.state;

		return (
			<Zoom in={loaded}>
				<Box component={Paper} display="flex" flexDirection="column" className={classes.singleRoot}>
					<Box display="flex" alignItems="center" className={classes.singleHeader}>
						<Box display="flex">
							<img src={crypto.image} alt="icon-crypto" className={classes.singleImage} />
						</Box>
						<Box display="flex" flexGrow={1} flexDirection="column">
							<Typography variant="h5">{crypto.symbol}</Typography>
							<Typography variant="subtitle1">{crypto.name}</Typography>
						</Box>
						<Box display="flex">
							<Typography variant="h6">{this.renderPrice(crypto.price)}</Typography>
						</Box>
					</Box>
					<Box display="flex" flexDirection="column" flex="1" justifyContent="center" className={classes.singleContent}>
						<Box display="flex" flex="1">
							<Box display="flex" flexGrow={1} flexDirection="column" justifyContent="center">
								<Typography variant="caption">{"Market Cap"}</Typography>
								<Typography variant="subtitle1">{`${this.simplifyNumber(crypto.marketCap)}`}</Typography>
							</Box>
							<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" className={classes.singlePercentage}>
								<Typography variant="caption">{"% 1h"}</Typography>
								{this.renderPercentages("subtitle1", crypto.change1h)}
							</Box>
						</Box>
						<Box display="flex" flex="1">
							<Box display="flex" flexGrow={1} flexDirection="column" justifyContent="center">
								<Typography variant="caption">{"Volume (24h)"}</Typography>
								<Typography variant="subtitle1">{`${this.simplifyNumber(crypto.volume)}`}</Typography>
							</Box>
							<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" className={classes.singlePercentage}>
								<Typography variant="caption">{"% 24h"}</Typography>
								{this.renderPercentages("subtitle1", crypto.change24h)}
							</Box>
						</Box>
						<Box display="flex" flex="1">
							<Box display="flex" flexGrow={1} flexDirection="column" justifyContent="center">
								<Typography variant="caption">{"Circulating Supply"}</Typography>
								<Typography variant="subtitle1">{`${this.simplifyNumber(crypto.circulatingSupply).substr(1)} ${crypto.symbol}`}</Typography>
							</Box>
							<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" className={classes.singlePercentage}>
								<Typography variant="caption">{"% 7d"}</Typography>
								{this.renderPercentages("subtitle1", crypto.change7d)}
							</Box>
						</Box>
					</Box>
				</Box>
			</Zoom>
		);
	}

	renderListView() {
		const { classes } = this.props;
		const { loaded, crypto } = this.state;

		return (
			<Zoom in={loaded}>
				<TableContainer component={Paper} className={classes.root}>
					<Table>
						<TableBody>
							{crypto.map(c => (
								<TableRow key={c.rank}>
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
			</Zoom>
		);
	}

	render() {
		const { loaded, crypto } = this.state;

		if (!loaded) return null;

		if (crypto.length) return this.renderListView();

		return this.renderSingleView();
	}
}

Crypto.propTypes = {
	classes: PropTypes.object.isRequired,
	coins: PropTypes.string.isRequired,
};

export default withStyles(styles)(Crypto);
