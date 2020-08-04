import React, { useContext } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

import { List } from "@material-ui/core";

import { UserContext } from "../../contexts/UserContext";

const containerVariants = {
	hidden: {
		opacity: 0,
	},
	visible: {
		opacity: 1,
		transition: {
			delay: 0.2,
			when: "beforeChildren",
			staggerChildren: 0.2,
		},
	},
};

const childVariants = {
	hidden: {
		x: -100,
		opacity: 0,
	},
	visible: {
		x: 0,
		opacity: 1,
		transition: { type: "tween" },
	},
};

function AnimatedList({ children }) {
	const { user } = useContext(UserContext);

	if (user.settings && !user.settings.animations) {
		return <List>{children}</List>;
	}

	return (
		<List>
			<motion.div variants={containerVariants} initial="hidden" animate="visible">
				{children.map(child => (
					<motion.div key={child.key} variants={childVariants}>
						{child}
					</motion.div>
				))}
			</motion.div>
		</List>
	);
}

AnimatedList.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AnimatedList;
