import Head from "next/head";
import { Container } from "semantic-ui-react";

const Layout = ({ children }) => (
	<div>
		<Head>
			<meta charSet="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" key="viewport" />
			<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css" />
			<title>VHooks</title>
		</Head>
		<Container>{children}</Container>
	</div>
);

export default Layout;
