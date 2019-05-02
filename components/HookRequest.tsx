import { Message, Segment } from "semantic-ui-react";

export const HookRequest = ({ hookRequest }) => {
	const { headers, query } = hookRequest;
	console.log(hookRequest);
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
					<p>
						query:{" "}
						{Object.keys(query).map((q, key) => (
							<div key={key}>
								{q}:{query[q]}
							</div>
						))}
					</p>
				</div>
			</Segment>
		</div>
	);
};
