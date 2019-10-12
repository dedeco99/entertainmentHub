const bcrypt = require("bcryptjs");

const { getUser, createUser, createToken } = require("./database");

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	return hash;
};

const generateToken = (length) => {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let token = "";
	for (var i = 0, n = charset.length; i < length; ++i) {
		token += charset.charAt(Math.floor(Math.random() * n));
	}

	return token;
};

const register = async (req, res) => {
	const { email, password } = req.body;
	const userExists = await getUser({ email });

	if (userExists) {
		res.json({ type: "error", text: "User already exists" });
	} else {
		await createUser({ email, password: await hashPassword(password) });

		res.json({ type: "success", text: "User registered successfully" });
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	const user = await getUser({ email });

	if (user) {
		const isPassword = await bcrypt.compare(password, user.password);

		if (isPassword) {
			const newToken = await createToken({ user: user._id, token: generateToken(60) });

			res.json({ type: "success", text: "Login successful", data: { user: user.id, token: newToken.token } });
		} else {
			res.json({ type: "error", text: "Password is incorrect" });
		}
	} else {
		res.json({ type: "error", text: "User is not registered" });
	}
};

module.exports = {
	register,
	login,
};
