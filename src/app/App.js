import React, { PureComponent } from "react";
import { render } from "react-dom";
import { ApolloClient, ApolloProvider, from, HttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Layout from "../ui/Layout";
import mainStorage from "../mainStorage";

export const currencyToSign = {
   GBP: "£",
   AUD: "AU$",
   JPY: "¥",
   RUB: "₽",
   USD: "$",
}

export function setMainStorage(Obj) {
   const mainStorage = JSON.parse(localStorage.getItem("mainStorage") || "{}");
   const newState = { ...mainStorage, ...Obj };
   localStorage.setItem("mainStorage", JSON.stringify(newState));
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
   _isMounted = true;

   constructor(props) {
	 super(props);
	 this.state = {
	    mainStorage: {
		  currency: undefined,
		  category: undefined,
		  isMenuDown: false,
		  isCartMode: false,
	    },
	 }
   }

   componentDidMount() {
	 window.addEventListener("storage", () => {
	    let mainStorage = JSON.parse(window.localStorage.getItem("mainStorage")) || {};
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
	 console.log(this.state.mainStorage)
	 return (
	    <ApolloProvider client={client}>
		  <Router>
			<Layout mainstorage={this.state.mainStorage} client={client}>
			   <Switch>
				 <Route path="/" exact>
				    <div><h1>HOME</h1></div>
				 </Route>
			   </Switch>

			</Layout>
		  </Router>
	    </ApolloProvider>
	 )
   }

}
render(<App/>, window.document.getElementById("root"));