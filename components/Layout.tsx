import Head from "next/head";
import { Container } from "semantic-ui-react";

const Layout = ({ children }) => (
	<>
		<Head>
			<meta charSet="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" key="viewport" />
			<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css" />
			<title>VHooks</title>
			<style global tsx>{`
				body {
					margin: 0;
					font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
						"Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
					display: grid;
					grid-template-columns: 100px auto 100px;
					grid-template-rows: 25% auto 25%;
				}

				code {
					font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
				}
			`}</style>
		</Head>

		{children}
	</>
);

export default Layout;
