import { useState } from "react";
import request from "../src/utils/Request";
import Router from "next/router";

const Home = () => {
	const [errorMsg, setErrorMsg] = useState("");

	async function onClickCreateHook() {
		const { status, data } = await request.post("/api/hooks");
		if (status !== 201) {
			setErrorMsg("Try again please!");
		}
		Router.push(`/p/${data.permalink}`);
	}

	return (
		<div>
			<h1>vHooks</h1>
			<div>
				<button onClick={onClickCreateHook}>Create hook</button>
				{errorMsg}
			</div>
		</div>
	);
};

export default Home;
