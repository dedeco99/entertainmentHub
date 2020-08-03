import { withStyles, TextField } from "@material-ui/core";

const Input = withStyles({
	root: {
		"& label.Mui-focused": {
			color: "white",
		},
		"& .MuiOutlinedInput-root": {
			"& fieldset": {
				borderColor: "white",
			},
			"&:hover fieldset": {
				borderColor: "white",
			},
			"&.Mui-focused fieldset": {
				borderColor: "white",
			},
		},
	},
})(TextField);

export default Input;
