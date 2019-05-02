import { useEffect, useState } from "react";
import io from "socket.io-client";
import { TextArea, Form, Button, Statistic } from "semantic-ui-react";
import dynamic from "next/dynamic";

import { HookRequest } from "../components";
import request from "../src/utils/Request";
import Layout from "../components/Layout";

const TextEditor = dynamic(() => import("../components/TextEditor"), { ssr: false });

const Hook = ({ url }) => {
	const { hook, hookRequestCount } = url.query;
	const [hookRequests, setHookRequests] = useState(hook.hookRequests || []);
	const [totalRequests, setTotalRequests] = useState(hookRequestCount);
	const socket = io();

	useEffect(() => {
		socket.on("newHookRequest", data => {
			const newHookRequest = [data, ...hookRequests];
			setHookRequests(newHookRequest);
			setTotalRequests(totalRequests + 1);
		});
		return () => {
			socket.disconnect();
		};
	}, [socket]);

	const [responseEvalCode, setResponseEvalCode] = useState(hook.responseEvalCode || "");
	const onChangeResponseEvalCode = value => {
		setResponseEvalCode(value);
	};

	const [enableUpdateBtn, setEnableUpdateBtn] = useState(false);
	const onValidateResponseEvalCode = errors => {
		if (errors.length > 0) {
			setEnableUpdateBtn(true);
		} else {
			setEnableUpdateBtn(false);
		}
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
						padding: 10px;
						border: 1px solid;
						cursor: pointer;
						margin-bottom: 10px;
					}

					.hookRequestsContainer {
						text-align: left;
						list-style: none;
					}

					.textEditorContainer {
						margin-bottom: 10px;
					}

					.responseEvalCodeBtnContainer {
						text-align: left;
					}

					.hookRequestCounter {
						margin: 10px 0;
					}

					.hookRequestContainer {
						margin: 20px 0;
					}
				`}
			</style>
			<h1>{hook.permalink}</h1>
			<div className="newHookRequestUrlContainer">
				Curl -X POST {`http://localhost:8080/api/newHookRequest/${hook.permalink}`}
			</div>
			<div className="textEditorContainer">
				<TextEditor
					onChange={onChangeResponseEvalCode}
					value={responseEvalCode}
					onValidate={(errors) => setEnableUpdateBtn(errors.length ? true : false)}
				/>
				{errorMsg}
			</div>
			<div className="responseEvalCodeBtnContainer">
				<Button className="updateResponseEvalCodeBtn" disabled={enableUpdateBtn} onClick={() => onClickUpdateResponseEvalCode(hook.id, responseEvalCode)} primary>Update</Button>
				{errorMsg}
			</div>
			<div className="hookRequestCounter">
				<Statistic horizontal>
					<Statistic.Value>{totalRequests}</Statistic.Value>
					<Statistic.Label>requests</Statistic.Label>
				</Statistic>
			</div>
			<ul className="hookRequestsContainer">
				{hookRequests.map(hookRequest => (
					<li className="hookRequestContainer" key={hookRequest.id}>
						<HookRequest hookRequest={hookRequest} />
					</li>
				))}
			</ul>
		</Layout>
	);
};

export default Hook;
