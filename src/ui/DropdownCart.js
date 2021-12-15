import React from "react";
import styles from "./Header.module.css";
import { getDistinctIDs as GetDistinctIDs } from "../utils/GetData";
import { currencyToSign, setMainStorage } from "../app/App";
import { Link } from "react-router-dom";
import ProductItem from "../components/ProductItem";

export default class DropdownCart extends React.Component {
	_isMounted = false;
	constructor(props) {
		super();
		this.state = {
			prices: {},
			total: 0
		}
	}

	componentDidMount() {
		this._isMounted = true;
		this.props.mainStorage.cartProducts.map((product, i) => {
			this.setState({
				prices: {
					...this.state.prices,
					[i]: product.prices[i].amount
				}
			})
		})
	}

	componentWillUnmount() {
		this._isMounted = false;
	}


	render() {
		let total = 0
		this.props.mainStorage.cartProducts.map((product, index) => product.prices.map((price, index) => {
			if (price.currency === this.props.mainStorage?.currency) {
				total += price.amount * product.amount
			}
			return total;
		}))

		return (
			<div className={styles.dropDownShoppingCart}>
				<div className={styles.dropDownShoppingCartTitle}>
					{GetDistinctIDs().size === 1 ? <h3>My bag, 1 item</h3> : <h3>My bag, {GetDistinctIDs().size} items</h3>}
				</div>
				<div className={styles.itemsContainer}>
					{(this.props?.mainStorage?.cartProducts || []).sort((a, b) => a.id.localeCompare(b.id)).map((product, index) => {
						return (
							<div key={index}>
								<ProductItem
									index={index}
									id={product.id}
									client={this.props.client}
									brand={product.brand}
									amount={product.amount}
									activeAttributes={product.activeAttributes}
									gallery={product.gallery}
									name={product.name}
									prices={product.prices}
									mainStorage={this.props.mainStorage}
								/>
							</div>
						)
					})}
				</div>
				<div className={styles.bottomContainer}>
					<div className={styles.totalPriceContainer}>
						<h3 className={styles.totalPrice}>Total</h3>
						<h3>
							{currencyToSign[this.props.mainStorage.currency]}
							{total.toFixed(2)}
						</h3>
					</div>
					<div className={styles.dropDownShoppingCartButtonContainer}>
						<div>
							<Link to={{
								pathname: "/cart",
								state: { mode: "cart" }
							}}>
								<button onClick={() => {
									this.props.setShow(null);
									setMainStorage({ category: "" })
								}} className={styles.viewBag}
								>VIEW BAG
								</button>
							</Link>
						</div>
						<div>
							<button className={styles.checkout}>CHECK OUT</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
