import React from "react";
import styles from "./Home.module.css";
import { LOAD_PRODUCTS } from "../graphQL/Queries";

export default class Home extends React.Component {
   constructor(props) {
	 super(props);
	 this.state = {
	    isLoading: true,
	    currentCategory: "All products",
	    result: undefined
	 }
   }
   _isMounted = false;

   componentDidMount() {
	 this._isMounted = true;
	 this.fetchData()
	 // this.fetchData();
   }

   fetchData() {
	 this.props.client.query({
	    query: LOAD_PRODUCTS
	 }).then((result) =>  {
	    if(this._isMounted) {
		  this.setState()
	    }
	 })
   }

   render() {
	 return (
	    <div>HAI MA COAIE</div>
	 )
   }
}