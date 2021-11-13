import React from "react";
import styles from "./Header.module.css";
import { getDistinctIDs as GetDistinctIDs } from "../utils/GetData";
import { currencyToSign, setMainStorage } from "../app/App";
import { Link } from "react-router-dom";

export default class DropdownCart extends React.Component {
	state = {
		prices: {}
	}

	render() {
		console.log(this.props)
		return (
			<div className={styles.dropDownShoppingCart}>
				<div className={styles.dropDownShoppingCartTitle}>
					<h3>My bag, {GetDistinctIDs().size}</h3>
				</div>
				<div className={styles.itemsContainer}>
					<div key={3}>
					</div>
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
