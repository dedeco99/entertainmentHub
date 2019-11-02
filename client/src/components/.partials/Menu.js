import { withStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const StyledMenu = withStyles({
	paper: {
		backgroundColor: "#333",
	}
})(Menu);

const StyledMenuItem = withStyles(theme => ({
	root: {
		"&:hover": {
			backgroundColor: "#222",
		},
	},
}))(MenuItem);

export {
	StyledMenu,
	StyledMenuItem
};
