import { useEffect, useState } from "react";
import io from "socket.io-client";

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
	});
	console.log(hookRequests);
	return (
		<div>
			<div>{hook.id}</div>
			<div>{hook.permalink}</div>
			<ul>
				{
					hookRequests.map(hookRequest => (
						<li key={hookRequest.id}>
							<div>
								<h4>id: {hookRequest.id}</h4>
								<p>requestid: {hookRequest.requestId}</p>
								<p>host: {hookRequest.host}</p>
								<p>httpVersion: {hookRequest.httpVersion}</p>
								<p>method: {hookRequest.method}</p>
								<p>dateCreated: {hookRequest.dateCreated}</p>
							</div>
						</li>
					))
				}
			</ul>
		</div>
	);
};

export default Hook;
