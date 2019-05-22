import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Button, Statistic, Pagination } from "semantic-ui-react";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";

import { HookRequest } from "../components";
import request from "../src/utils/Request";
import Layout from "../components/Layout";

const TextEditor = dynamic(() => import("../components/TextEditor"), { ssr: false });
const socket = io();

const PaginationMax = 5;
const Hook = ({ router, data }) => {
	const { hook, hostAddress } = router.query;
	const [hookRequests, setHookRequests] = useState(data.hookRequests || []);
	const [totalRequests, setTotalRequests] = useState(data.totalCount);
	const [currentPage, setCurrentPage] = useState(1);

	socket.on("newHookRequest", data => {
		setHookRequests([data, ...hookRequests]);
		setTotalRequests(totalRequests + 1);
	});

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
		const { status } = await request.put(`/api/hooks/${id}`, { responseEvalCode: evalCode });
		if (status !== 200) {
			setErrorMsg("Try again please!");
		}
	};

	const onPageChange = async (event, pageData) => {
		const { activePage } = pageData;
		const skip = PaginationMax * (activePage - 1);
		const { data, status } = await request.get(`/api/hookRequests/${hook.id}?max=${PaginationMax}&skip=${skip}`);
		if (status !== 200) {
			console.error(status);
			return;
		}
		setHookRequests(data.hookRequests);
		setCurrentPage(activePage);
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
						text-align: left;
					}
				`}
			</style>
			<h1>{hook.permalink}</h1>
			<div className="newHookRequestUrlContainer">
				curl -X POST {`${hostAddress}/api/newHookRequest/${hook.permalink}`}
			</div>
			<div className="textEditorContainer">
				<TextEditor
					onChange={onChangeResponseEvalCode}
					value={responseEvalCode}
					onValidate={onValidateResponseEvalCode}
				/>
				{errorMsg}
			</div>
			<div className="responseEvalCodeBtnContainer">
				<Button
					className="updateResponseEvalCodeBtn"
					disabled={enableUpdateBtn}
					onClick={() => onClickUpdateResponseEvalCode(hook.id, responseEvalCode)}
					primary>
					Update
				</Button>
				{errorMsg}
			</div>
			<div className="hookRequestCounter">
				<Statistic horizontal>
					<Statistic.Value>{totalRequests}</Statistic.Value>
					<Statistic.Label>requests</Statistic.Label>
				</Statistic>
			</div>
			<Pagination activePage={currentPage} totalPages={Math.ceil(totalRequests / PaginationMax)} onPageChange={onPageChange} />
			{hookRequests.map(hookRequest => (
				<div className="hookRequestContainer" key={hookRequest.id}>
					<HookRequest hookRequest={hookRequest} />
				</div>
			))}
		</Layout>
	);
};

Hook.getInitialProps = async ({ query }) => {
	const { hook } = query;
	const { data, status } = await request.get(`http://127.0.0.1:${process.env.NODE_PORT}/api/hookRequests/${hook.id}?max=${PaginationMax}&skip=0`);
	if (status !== 200) {
		return { data: { hookRequests: [], totalCount: 0, max: 0, skip: 0 } };
	}

	return { data };
};

export default withRouter(Hook);
