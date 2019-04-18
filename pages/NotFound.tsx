const NotFound = ({ url }) => {
	const { query } = url;
	return (
		<div>
			<h1>{query.id} not found</h1>
		</div>
	);
};

export default NotFound;
