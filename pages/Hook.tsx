import { useEffect, useState } from "react";
import io from "socket.io-client";
import { TextArea } from "semantic-ui-react";
import { HookRequest } from "../components";
import request from "../src/utils/Request";
import Layout from "../components/Layout";

const Hook = ({ url }) => {
	console.log(url.pathname);
	const { hook } = url.query;
	const [hookRequests, setHookRequests] = useState(hook.hookRequests || []);
	const socket = io();

	useEffect(() => {
		socket.on("newHookRequest", data => {
			const newHookRequest = [...hookRequests, data];
			setHookRequests(newHookRequest);
		});
		return () => {
			socket.disconnect();
		};
	}, [socket]);

	const [responseEvalCode, setResponseEvalCode] = useState(hook.responseEvalCode || "");
	const onChangeResponseEvalCode = event => {
		setResponseEvalCode(event.target.value);
	};

	const [errorMsg, setErrorMsg] = useState("");
	const onClickUpdateResponseEvalCode = async (id, evalCode) => {
		const { data, status } = await request.put(`/api/hooks/${id}`, { responseEvalCode: evalCode });
		if (status !== 200) {
			setErrorMsg("Try again please!");
		}
		console.log(data);
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

					.newHookRequestUrlContainer {
						margin: 10px;
						padding: 10px;
						border: 1px solid;
						cursor: pointer;
					}

					.hookRequestsContainer {
						text-align: left;
						list-style: none;
					}

			`}
			</style>
			<h1>{hook.permalink}</h1>
			<div className="newHookRequestUrlContainer">
				Curl -X POST {`http://localhost:8080/api/newHookRequest/${hook.permalink}`}
			</div>
			<TextArea
				name="responseEvalCode"
				value={responseEvalCode}
				placeholder="Customize response here"
				rows={10}
				onChange={onChangeResponseEvalCode}
			/>
			<div>
				<button onClick={() => onClickUpdateResponseEvalCode(hook.id, responseEvalCode)}>Update</button>
				{errorMsg}
			</div>
			<ul className="hookRequestsContainer">
				{hookRequests.map(hookRequest => (
					<li key={hookRequest.id}>
						<HookRequest hookRequest={hookRequest} />
					</li>
				))}
			</ul>
		</Layout>
	);
};

export default Hook;
