import axios from "axios";

const request = axios.create({
	timeout: 5000,
	headers: {
		"Content-Type": "application/json",
	},
});

export default request;
