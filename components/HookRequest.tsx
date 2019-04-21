export const HookRequest = ({ hookRequest }) => (
	<>
		<h4>id: {hookRequest.id}</h4>
		<p>requestid: {hookRequest.requestId}</p>
		<p>host: {hookRequest.host}</p>
		<p>httpVersion: {hookRequest.httpVersion}</p>
		<p>method: {hookRequest.method}</p>
		<p>dateCreated: {hookRequest.dateCreated.toString()}</p>
	</>
);
