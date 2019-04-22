import { useEffect, useState } from "react";
import io from "socket.io-client";
import { HookRequest } from "../components";
import request from "../src/utils/Request";
import { Layout } from "../components";

const Hook = ({ url }) => {
	const { hook } = url.query;
	const [hookRequests, setHookRequests] = useState(hook.hookRequests || []);
	useEffect(() => {
		const socket = io();
		socket.on("newHookRequest", data => {
			const newHookRequest = [...hookRequests, data];
			setHookRequests(newHookRequest);
		});
		return () => {
			socket.disconnect();
		};
	}, []);

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
			<style tsx>
				{`
					body > div {
						grid-row: 2;
						grid-column: 2;
						text-align: center;
					}
			`}
			</style>
			<div>{hook.id}</div>
			<div>{hook.permalink}</div>
			<textarea
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
			<ul>
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
