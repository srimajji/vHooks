import { useState } from "react";
import Router from "next/router";
import { Button, Input } from "semantic-ui-react";

import Layout from "../components/Layout";
import request from "../src/utils/Request";

const Home = () => {
	const [errorMsg, setErrorMsg] = useState("");
	const [permalink, setPermalink] = useState("");

	const onChangePermalink = ({ target }) => {
		setPermalink(target.value);
	};

	const onClickCreateHook = async permalink => {
		try {
			const error = new Error("Error creating new hook");
			const specialCharRegex = RegExp(/[^a-zA-Z ]/g);
			if (specialCharRegex.test(permalink)) {
				throw error;
			}
			const { status, data } = await request.post("/api/hooks", { permalink });
			if (status !== 201) {
				throw error;
			}
			Router.push(`/p/${data.permalink}`);
		} catch (e) {
			setErrorMsg("Try again please!");
		}
	};

	return (
		<Layout>
			<style tsx>
				{`
					body > div {
						grid-row: 2;
						grid-column: 2;
						text-align: center;
					}
			`}
			</style>
			<h1>vHooks</h1>
			<Input
				placeholder="Permalink"
				value={permalink}
				onChange={onChangePermalink}
				label={<Button onClick={() => onClickCreateHook(permalink)}>Create hook</Button>}
				labelPosition="right"
			/>
			<p>{errorMsg}</p>
		</Layout>
	);
};

export default Home;
