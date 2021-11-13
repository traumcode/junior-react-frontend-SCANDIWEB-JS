import React from "react";
import { ReactComponent as CircleCart } from "../resources/circleCart.svg";
import { currencyToSign } from "../app/App";
import { Link } from "react-router-dom";
import styles from './Product.module.css';

export const getPrice = (prices = [], currency = "USD") => {
	let price = prices.find((item) => item.currency === currency);
	const currencySign = currencyToSign[price?.currency];
	return currencySign + "   " + (price.amount || "?");
};

export default class Product extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			name: this.props.name,
			brand: this.props.brand,
			availableAttributes: this.props.attributes,
			image: this.props.image,
			inStock: this.props.inStock,
			id: this.props.id,
			prices: this.props.prices
		}
	}

	render() {
		return (
			<div className={`${!this.props.inStock ? styles.productIsOutOfStock : ""} ${styles.productCard}`}>
				<Link
					className={styles.link}
					to={{
						pathname: `/product/${this.props.id}`,
						state: {
							id: this.props.id,
						},
					}}
				>
					<div className={styles.imageContainer}>
						<img className={styles.productImage} src={this.props.image} alt="item"/>
						<h3 className={`${!this.props.inStock ? styles.textOutOfStock : styles.productHide}`}>OUT OF STOCK</h3>
					</div>
				</Link>
				<div onClick={() => this.addToCard(this.props.id)} className={styles.cardContent}>
					{this.props.inStock ? <CircleCart className={styles.cartCircle}/> : ""}

					<Link
						className={styles.link}
						to={{
							pathname: `/product/${this.props.id}`,
							state: {
								id: this.props.id,
							},
						}}
					>
						<div className={styles.nameBrandContainer}>
							<h3 className={styles.productTitle}>{this.props.name} </h3>
							<h3 className={styles.productTitle}>{this.props.brand}</h3>
						</div>
						<h3>{getPrice(this.props?.prices, this.props.currency)}</h3>
					</Link>
				</div>
			</div>
		)
	}
}