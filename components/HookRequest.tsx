import { Message, Segment } from "semantic-ui-react";

export const HookRequest = ({ hookRequest }) => {
	const { headers, query, hookResponse, body } = hookRequest;
	return (
		<div>
			<Message attached header={`${hookRequest.method} /${hookRequest.requestId}`} />
			<Segment attached>
				<div>
					<p>{hookRequest.host}</p>
					<p>httpVersion: {hookRequest.httpVersion}</p>
					<p>dateCreated: {hookRequest.dateCreated.toString()}</p>
					<div>
						<pre>{JSON.stringify(headers, undefined, 2)}</pre>
					</div>
					<div>
						queryParams:
						<pre>{JSON.stringify(query, undefined, 2)}</pre>
					</div>
					<div>
						body:
						<pre>{JSON.stringify(body, undefined, 2)}</pre>
					</div>
					<div>
						hookResponse:
						<pre>{JSON.stringify(hookResponse, undefined, 2)}</pre>
					</div>
				</div>
			</Segment>
		</div>
	);
};
