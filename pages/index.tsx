import axios from "axios";

const Index = ({ data }) => {
	return (
		<ul>
			{
				data.map(hook => (
					<li key={hook.id}>
						<div>{hook.id}</div>
						<div>{hook.permalink}</div>
					</li>
				))
			}
		</ul>
	);
};

Index.getInitialProps = async function () {
	const response = await axios.get("http://127.0.0.1:8080/api/hooks/all");
	return { data: response.data };
};

export default Index;
