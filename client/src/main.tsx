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
	split,
} from "@apollo/client";
import { BASEURL, getToken,  } from "./apiData.ts";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const queryClient = new QueryClient();

const authLink = setContext((_operation, { headers }) => {
	return { headers: { ...headers, Authorization: getToken() } };
});

const httpLink = new HttpLink({
	uri: `${BASEURL}/graphql`,
});

const wsLink = new GraphQLWsLink(
	createClient({
		url: "ws://localhost:3000/api/subscriptions",
		connectionParams: () => {
			return { auth: getToken() };
		},
	})
);

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === "OperationDefinition" &&
			definition.operation === "subscription"
		);
	},
	wsLink,
	authLink.concat(httpLink)
);

const apolloClient = new ApolloClient({
	link: splitLink,
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
