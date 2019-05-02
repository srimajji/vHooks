import { useState } from "react";
import Router from "next/router";
import Link from "next/link";
import { Button, Input, List } from "semantic-ui-react";

import Layout from "../components/Layout";
import request from "../src/utils/Request";

const Home = ({ url }) => {
	const [errorMsg, setErrorMsg] = useState("");
	const [permalink, setPermalink] = useState("");
	const [hooks, setHooks] = useState(url.query.hooks);

	const onChangePermalink = ({ target }) => {
		setPermalink(target.value);
	};

	const onChangeSearchHooks = async ({ target }) => {
		const { status, data } = await request.get(`/api/hooks?q=${target.value}`);
		if (status !== 200) {
			return;
		}
		setHooks(data.hooks);
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
			<style>
				{`
					body > div {
						grid-row: 2;
						grid-column: 2;
						text-align: center;
					}

					.searchInput {
						margin-right: 50px;
					}
				`}
			</style>
			<div>
				<h1>vHooks</h1>
				<Input
					placeholder="Search"
					onChange={onChangeSearchHooks}
					label={<Button onClick={() => onClickCreateHook(permalink)}>Search</Button>}
					labelPosition="right"
					className="searchInput"
				/>
				<Input
					placeholder="Permalink"
					value={permalink}
					onChange={onChangePermalink}
					label={<Button onClick={() => onClickCreateHook(permalink)}>Create hook</Button>}
					labelPosition="right"
				/>
				<p>{errorMsg}</p>
			</div>
			<List className="hooksContainer" verticalAlign="middle" animated>
				{
					hooks.map(hook => (
						<List.Item key={hook.id}><Link as={`/p/${hook.permalink}`}>{hook.permalink}</Link></List.Item>
					))
				}
			</List>
		</Layout>
	);
};

export default Home;
