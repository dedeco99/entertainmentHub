import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Zoom, Box, Typography, Divider, Tooltip } from "@material-ui/core";

import Loading from "../.partials/Loading";

import { getProduct } from "../../api/price";

function Price({ country, productId, widgetDimensions }) {
	const [product, setProduct] = useState(null);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		let isMounted = true;

		async function fetchData() {
			setOpen(false);

			const response = await getProduct(country, productId);

			if (response.status === 200 && isMounted) {
				setProduct(response.data);
				setOpen(true);
			}
		}

		fetchData();

		return () => (isMounted = false);
	}, [productId]);

	if (!open) return <Loading />;

	function renderDefault() {
		return (
			<Box display="flex" flexDirection="column" width="100%" height="100%" p={2}>
				<Box display="flex" flex="1 0 0" minHeight={0}>
					<img
						src={product.image}
						alt="Product"
						height="100%"
						width="100%"
						display="block"
						style={{ objectFit: "scale-down", backgroundColor: "white" }}
					/>
				</Box>
				<Box display="flex" flex="1 0 0" flexDirection="column" justifyContent="center">
					<Typography variant="body2">{product.name}</Typography>
					<Typography variant="body1">{product.price}</Typography>
				</Box>
				<Divider />
				<Box display="flex" pt={1}>
					<Box display="flex" flexGrow={1} alignItems="center" justifyContent="center" color="#f4511e">
						<Tooltip title="Highest price" placement="top">
							<Typography variant="subtitle2" color="inherit">
								<i className="icon-caret-up" />
								{product.history.highest}
							</Typography>
						</Tooltip>
					</Box>
					<Box display="flex" flexGrow={1} alignItems="center" justifyContent="center" color="#ff9800">
						<Tooltip title="Average price" placement="top">
							<Typography variant="subtitle2" color="inherit">
								{"~"}
								{product.history.average}
							</Typography>
						</Tooltip>
					</Box>
					<Box display="flex" flexGrow={1} alignItems="center" justifyContent="center" color="#43a047">
						<Tooltip title="Lowest price" placement="top">
							<Typography variant="subtitle2" color="inherit">
								<i className="icon-caret-down" />
								{product.history.lowest}
							</Typography>
						</Tooltip>
					</Box>
				</Box>
			</Box>
		);
	}

	function render1x1() {
		return (
			<Box display="flex" flexDirection="column" alignItems="center">
				<Box display="flex" alignItems="center" mb={1}>
					<img
						src={product.image}
						height="64px"
						width="64px"
						alt="Product"
						style={{ objectFit: "scale-down", borderRadius: "50%" }}
					/>
				</Box>
				<Box display="flex" alignItems="center">
					<Typography variant="h6">{product.price}</Typography>
				</Box>
			</Box>
		);
	}

	function renderType() {
		if (widgetDimensions.h === 1 && widgetDimensions.w === 1) {
			return render1x1();
		}
		return renderDefault();
	}

	return <Zoom in={open}>{renderType()}</Zoom>;
}

Price.propTypes = {
	country: PropTypes.string.isRequired,
	productId: PropTypes.string.isRequired,
	widgetDimensions: PropTypes.object,
};

export default Price;
