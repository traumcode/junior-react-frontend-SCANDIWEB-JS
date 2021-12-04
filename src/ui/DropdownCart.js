import React from "react";
import styles from "./Header.module.css";
import { getDistinctIDs as GetDistinctIDs } from "../utils/GetData";
import { currencyToSign, setMainStorage } from "../app/App";
import { Link } from "react-router-dom";
import ProductItem from "../components/ProductItem";

export default class DropdownCart extends React.Component {
	state = {
		prices: {}
	}

	render() {
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
							{Object.values(this.state.prices).reduce((a, v) => a + v, 0).toFixed(2)}
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
