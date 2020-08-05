import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Zoom, Box, Typography } from "@material-ui/core";

import Loading from "../.partials/Loading";

import { getProduct } from "../../api/price";

function Price({ productId }) {
	const [product, setProduct] = useState(null);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		async function fetchData() {
			const response = await getProduct(productId);

			if (response.status === 200) {
				setProduct(response.data);
				setOpen(true);
			}
		}

		fetchData();
	}, [productId]);

	if (!open) return <Loading />;

	return (
		<Zoom in={open}>
			<Box display="flex" flexDirection="column" alignItems="center">
				<Box display="flex" alignItems="center">
					<img src={product.image} alt="Product Image" />
				</Box>
				<Box display="flex" alignItems="center">
					<Typography variant="h5">{product.name}</Typography>
				</Box>
				<Box display="flex" alignItems="center">
					<Typography variant="h6">{product.price}</Typography>
				</Box>
				<Box display="flex" alignItems="center">
					<Typography variant="caption">{"Highest price: "}</Typography>
					<Typography variant="subtitle1">{product.history.highest}</Typography>
				</Box>
				<Box display="flex" alignItems="center">
					<Typography variant="caption">{"Lowest price: "}</Typography>
					<Typography variant="subtitle1">{product.history.lowest}</Typography>
				</Box>
				<Box display="flex" alignItems="center">
					<Typography variant="caption">{"Average price: "}</Typography>
					<Typography variant="subtitle1">{product.history.average}</Typography>
				</Box>
			</Box>
		</Zoom>
	);
}

Price.propTypes = {
	productId: PropTypes.string.isRequired,
};

export default Price;
