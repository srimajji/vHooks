import get from "lodash/get";

export const HookRequest = ({ hookRequest }) => {
	const { headers } = hookRequest;
	const { query } = hookRequest;
	return (
		<>
			<h2>{hookRequest.id}</h2>
			<div>
				<p><strong>requestid</strong>: {hookRequest.requestId}</p>
				<p><strong>host</strong>: {hookRequest.host}</p>
				<p>httpVersion: {hookRequest.httpVersion}</p>
				<p>method: {hookRequest.method}</p>
				<p>dateCreated: {hookRequest.dateCreated.toString()}</p>
				<p>headers: {Object.keys(headers).map((header, key) => (
					<p key={key}><strong>{header}</strong>:{headers[header]}</p>
				))}
				</p>
				<p>query: {Object.keys(query).map((q, key) => (
					<div key={key}>{q}:{query[q]}</div>
				))}
				</p>
			</div>
		</>
	);
};
