import React from "react";
import { LOAD_PRODUCTS } from "../graphQL/Queries";
import styles from "./Home.module.css"
import Product from "../components/Product";

export default class Home extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			currentCategory: "All products",
			result: undefined
		}
	}

	componentDidMount() {
		this._isMounted = true;
		this.fetchData()
	}

	fetchData() {
		this.props.client.query({
			query: LOAD_PRODUCTS
		}).then((result) => {
			if (this._isMounted) {
				this.setState({ result });

				/*
				because there is too little information, the fetch is very fast and it is impossible for the loading bar to appear,
				so I put a 2 second timer just to show this beautiful bar

				^_^

				*/

				setTimeout(() => {
					this.setState({ isLoading: false });
				}, 500);
			}
		}).catch((error) => {console.error(error)})
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	displayProducts() {
		if (this.state.result?.loading) {
			return <div>LOADING</div>;
		} else if (this.props?.mainStorage?.category !== "home") {
			return this.state.result?.data.categories.map((category) => {
				return category?.products.map((product, index) => {
					if (product.category === this.props?.mainStorage?.category) {

						return (
							<Product
								key={index}
								attributes={product.attributes}
								brand={product.brand}
								id={product.id}
								inStock={product.inStock}
								prices={product.prices}
								currency={this.props.mainStorage.currency}
								image={product.gallery[0]}
								name={product.name}
							/>
						);
					}
					return null;
				});
			});
		}
		return this.state.result?.data.categories.map((category) => {
			return category?.products.map((product, index) => {
				return (
					<Product
						key={index}
						attributes={product.attributes}
						brand={product.brand}
						id={product.id}
						inStock={product.inStock}
						prices={product.prices}
						currency={this.props.mainStorage.currency}
						image={product.gallery[0]}
						name={product.name}
					/>
				);
			});
		});
	}

	render() {
		if (this.state.isLoading) return <div className={styles.loadingBar}/>;
		return (
			<div className={styles.mainContainer}>
				<div className={styles.categoryNameContainer}>
					<h2 className={styles.categoryName}>{this.props?.mainStorage?.category?.toLocaleUpperCase()}</h2>
				</div>
				<div className={styles.productContainer}>{this.displayProducts()}</div>
			</div>
		);
	}
}