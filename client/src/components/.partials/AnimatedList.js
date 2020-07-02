import React from "react";
import { motion } from "framer-motion";

import List from "@material-ui/core/List";

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
	return (
		<List>
			<motion.div variants={containerVariants} initial="hidden" animate="visible">
				{children.map(child => <motion.div key={child.key} variants={childVariants}>{child}</motion.div>)}
			</motion.div>
		</List>
	);
}

export default AnimatedList;
