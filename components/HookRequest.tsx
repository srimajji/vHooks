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
				<div>headers: {Object.keys(headers).map((header, key) => (
					<div key={key}><strong>{header}</strong>:{headers[header]}</div>
				))}
				</div>
				<p>query: {Object.keys(query).map((q, key) => (
					<div key={key}>{q}:{query[q]}</div>
				))}
				</p>
			</div>
		</>
	);
};
