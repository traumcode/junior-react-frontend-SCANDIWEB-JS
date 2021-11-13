import Home from "../pages/Home";
import Layout from "../ui/Layout";
import { render } from "react-dom";
import React, { PureComponent } from "react";
import { getDistinctIDs } from "../utils/GetData";
import { onError } from "@apollo/client/link/error";
import { ApolloClient, ApolloProvider, from, HttpLink, InMemoryCache } from "@apollo/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProductPage from "../pages/ProductPage";

export const currencyToSign = {
	GBP: "£",
	AUD: "AU$",
	JPY: "¥",
	RUB: "₽",
	USD: "$",
}

export function setMainStorage(Obj) {
	const mainStorage = JSON.parse(localStorage.getItem("MainStorage") || "{}");
	const newState = { ...mainStorage, ...Obj };
	localStorage.setItem("MainStorage", JSON.stringify(newState));
	window.dispatchEvent(new Event("storage"));
}

const errorLink = onError(({
										graphQLErrors,
										networkError
									}) => {
	if (graphQLErrors) {
		graphQLErrors.map(({
									 message,
									 path
								 }) => {
			return alert(`GraphQL error ${message}`);
		});
	}
});


const link = from([ errorLink, new HttpLink({ uri: "http://localhost:4000/" }) ]);

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: link,
});

export default class App extends PureComponent {
	state = {
		mainStorage: {
			currency: undefined,
			category: undefined,
			isMenuDown: false,
			isCartMode: false,
		},
	}

	_isMounted = true;


	componentDidMount() {
		window.addEventListener("storage", () => {
			let mainStorage = JSON.parse(window.localStorage.getItem("MainStorage")) || {};
			if (this._isMounted) {
				mainStorage.currency = mainStorage?.currency || "USD";
				mainStorage.category = mainStorage?.category || "home";

				this.setState({
					mainStorage: mainStorage || {},
				});
			}
		});
		window.dispatchEvent(new Event("storage"));
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		return (
			<ApolloProvider client={client}>
				<Router>
					<Layout mainStorage={this.state.mainStorage} client={client}>
						<Switch>
							<Route path="/" exact getDistinctIDs={getDistinctIDs}>
								<Home client={client} mainStorage={this.state.mainStorage}/>
							</Route>
							<Route path="/category/:category"
									 render={(props) => <Home {...props} client={client} mainStorage={this.state.mainStorage}/>}>
							</Route>
							<Route path="/product/:id"
									 render={(props) => <ProductPage {...props} mainStorage={this.state.mainStorage} client={client}/>}>
							</Route>
						</Switch>

					</Layout>
				</Router>
			</ApolloProvider>
		)
	}

}
render(<App/>, window.document.getElementById("root"));