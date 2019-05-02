import Head from "next/head";

const Layout = ({ children }) => (
	<>
		<Head>
			<meta charSet="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" key="viewport" />
			<link async rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css" />
			<title>VHooks</title>
			<style>{`
				html {
					height: 100%;
				}

				body {
					height: 100%;
					margin: 0;
					font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
						"Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
					display: grid;
					grid-template-columns: 100px auto 100px;
					grid-template-rows: 100px auto 100px;
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
