import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { TokenContextProvider } from "./components/TokenContextProvider.tsx";
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	HttpLink,
} from "@apollo/client";
import { BASEURL, TOKEN } from "./apiData.ts";
import { setContext } from "@apollo/client/link/context";

const queryClient = new QueryClient();
const authLink = setContext(
	(
		_operation,
		{ headers }
	)  => {
		return { headers: { ...headers, Authorization: TOKEN } };
	}
);
const httpLink = new HttpLink({
	uri: `${BASEURL}/graphql`,
});
const apolloClient = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
	<ApolloProvider client={apolloClient}>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<TokenContextProvider>
					<App />
				</TokenContextProvider>
			</BrowserRouter>
		</QueryClientProvider>
	</ApolloProvider>
);
