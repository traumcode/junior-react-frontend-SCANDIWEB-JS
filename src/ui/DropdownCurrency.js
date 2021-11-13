import React, { Component } from 'react';
import styles from "./Header.module.css";
import { currencyToSign, setMainStorage } from "../app/App";

export default class DropdownCurrency extends Component {
	render() {
		return (
			<div className={styles.currencyContent}> {Object.keys(currencyToSign).map((currency, index) => {
				return (
					<button
						key={index}
						className={styles.currencyButton}
						onClick={() => {
							setMainStorage({ currency });
							this.props.setShow(null);
						}}>
						<h3 className={styles.currencyButtonText}>
							{currencyToSign[currency]}
							{currency}
						</h3>
					</button>);
			})}
			</div>
		);
	}
}