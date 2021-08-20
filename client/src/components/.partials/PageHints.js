import React, { useState, useEffect, useContext } from "react";

import { makeStyles, Typography } from "@material-ui/core";
import { IconButton, Modal, Box, Card, CardContent, Tab, Tabs, Grid, CardMedia } from "@material-ui/core";

import { UserContext } from "../../contexts/UserContext";

import { translate } from "../../utils/translations";

import styles from "../../styles/General";

const useStyles = makeStyles(styles);

const TabPanels = props => {
	return <div hidden={props.value !== props.index}>{props.value === props.index && props.children}</div>;
};

function PageHints() {
	const classes = useStyles();
	const [openModal, setOpenModal] = useState(false);
	const [selectedTab, setSelectedTab] = useState(0);
	const { user } = useContext(UserContext);

	function handleOpenModal() {
		setOpenModal(true);
	}

	function handleCloseModal() {
		setOpenModal(false);
	}

	function handleChangeTab(e, tab) {
		setSelectedTab(tab);
	}

	function handleRenderButton() {
		if (user.settings.appHints) {
			return (
				<IconButton
					className={classes.goBackUp}
					color="primary"
					style={{ backgroundColor: "#EC6E4C", bottom: "10px" }}
					onClick={handleOpenModal}
				>
					<i className="icon-question" style={{ fontSize: "1.5rem " }} />
				</IconButton>
			);
		}
	}

	return (
		<Box>
			<Modal open={openModal} closeAfterTransition>
				<Box>
					<IconButton
						color="primary"
						onClick={handleCloseModal}
						variant="contained"
						style={{
							marginTop: "10px",
							marginLeft: "10px",
							backgroundColor: "#3C3C3C",
							padding: "8px",
							fontSize: "1.2rem",
						}}
					>
						<i className="icon-cross icon-1x" />
					</IconButton>
					<Card
						variant="outlined"
						style={{
							borderRadius: "1px",
							border: "1px solid rgba(255, 255, 255, 0.12)",
							borderLeft: "0px",
							borderRight: "0px",
							borderTop: "0px",
							backgroundColor: "#212121",
							width: "60%",
							margin: "auto",
							height: "80%",
						}}
					>
						<CardContent style={{ height: "48px" }}>
							<Tabs
								value={selectedTab}
								onChange={handleChangeTab}
								aria-label="simple tabs example"
								variant="scrollable"
								style={{ marginTop: "-16px", marginLeft: "-16px" }}
							>
								<Tab label="Widgets" key={0} />
								<Tab label="Tabs" key={1} />
							</Tabs>
						</CardContent>
						<CardContent style={{ backgroundColor: "rgba(66, 66, 66, 1)" }}>
							<Grid container style={{ outline: "none", height: "100%", width: "100%" }}>
								<Grid xs={5}>
									<TabPanels value={selectedTab} index={0}>
										<Typography variant="h5" style={{ textAlign: "center", paddingBottom: "5px" }}>
											{translate("addWidget")}
										</Typography>
										<CardMedia
											component="iframe"
											frameBorder={0}
											allowFullScreen
											style={{ height: "400px" }}
											src="https://www.youtube.com/embed/VmzG0i4pEFE"
										></CardMedia>
									</TabPanels>
								</Grid>
								<Grid xs={1}></Grid>
								<Grid xs={5}>
									<TabPanels value={selectedTab} index={0}>
										<Typography variant="h5" style={{ textAlign: "center", paddingBottom: "5px" }}>
											{translate("actionsWidget")}
										</Typography>
										<CardMedia
											component="iframe"
											frameBorder={0}
											allowFullScreen
											style={{ height: "400px" }}
											src="https://www.youtube.com/embed/gBg1sHZr6j0"
										></CardMedia>
									</TabPanels>
								</Grid>
								<Grid xs={5}>
									<TabPanels value={selectedTab} index={1}>
										<Typography variant="h5" style={{ textAlign: "center", paddingBottom: "5px" }}>
											{translate("addTab")}
										</Typography>
										<CardMedia
											component="iframe"
											frameBorder={0}
											allowFullScreen
											style={{ height: "400px" }}
											src="https://www.youtube.com/embed/O-o6OpXGK7Y"
										></CardMedia>
									</TabPanels>
								</Grid>
								<Grid xs={1}></Grid>
								<Grid xs={5}>
									<TabPanels value={selectedTab} index={1}>
										<Typography variant="h5" style={{ textAlign: "center", paddingBottom: "5px" }}>
											{translate("actionsTab")}
										</Typography>
										<CardMedia
											component="iframe"
											frameBorder={0}
											allowFullScreen
											style={{ height: "400px" }}
											src="https://www.youtube.com/embed/E6bGO7l2Ldc"
										></CardMedia>
									</TabPanels>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Box>
			</Modal>
			{handleRenderButton()}
		</Box>
	);
}

export default PageHints;
