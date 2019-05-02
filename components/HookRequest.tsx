import { Message, Segment } from "semantic-ui-react";

export const HookRequest = ({ hookRequest }) => {
	const { headers } = hookRequest;
	const { query } = hookRequest;
	console.log(hookRequest);
	return (
		<div>
			<Message attached header={`${hookRequest.method} ${hookRequest.requestId}`} />
			<Segment attached>
				<div>
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
			</Segment>
		</div>
	);
};
