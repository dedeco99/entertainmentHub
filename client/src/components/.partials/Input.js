import { withStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";

const Input = withStyles({
	root: {
		'& label.Mui-focused': {
			color: 'white',
		},
		'& .MuiOutlinedInput-root': {
			'& fieldset': {
				borderColor: 'white',
			},
			'&:hover fieldset': {
				borderColor: 'white',
			},
			'&.Mui-focused fieldset': {
				borderColor: 'white',
			},
		},
	},
})(TextField);

export default Input;