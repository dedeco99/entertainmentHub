const bcrypt = require("bcryptjs");

const { getUser, createUser } = require("./database");

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	return hash;
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
			res.json({ type: "success", text: "Login successful", data: { user: user.id, token: "lmao" } });
		} else {
			res.json({ type: "error", text: "Password is incorrect" });
		}
	} else {
		res.json({ type: "error", text: "User is not registered" });
	}
};

const validateToken = async (req, res) => {
	const { token } = req.params;

	const user = await getToken({ token });
};

module.exports = {
	register,
	login,
	validateToken
};
