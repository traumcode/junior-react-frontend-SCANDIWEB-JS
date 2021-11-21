import React from "react";
import { PRODUCT_BY_ID } from "../graphQL/Queries";
import styles from "./ProductItem.module.css"
import {Link} from "react-router-dom";


export default class ProductItem extends React.Component {
	_isMounted = false;
	downloading = false;

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true
		}
	}

	async componentDidUpdate(prevProps) {
		await this.fetchData();
		if (this.state.isLoading) {
			this.setState({ isLoading: false });
		}
		if (prevProps.amount !== this.props.amount) {
			this.props.onFetch?.(this.state.product, this.getPrice(this.state.product.prices))
		}
	}

	componentDidMount() {
		this._isMounted = true;
		this.fetchData();
	}

	fetchData() {
		if (this.downloading || this.state?.product?.id === this.props.id) {
			return;
		}
		this.downloading = true;
		return this.props.client
			.query({
				query: PRODUCT_BY_ID(this.props.id),
			})
			.then((result) => {
				if (this._isMounted) {
					const product = result.data.product;
					this.setState({ product });
					this.props.onFetch?.(product, this.getPrice(product.prices));
				}
				return result;
			})
			.catch((err) => console.error(err));
	}

	componentWillUnmount() {
		this._isMounted = false;
	}


	render() {
		console.log(this.state)
		let count = 0;
		const { product } = this.state;
		if (!this.state.product) {
			return null;
		}
		return (
			<div key={product.id}>
				<div className={styles.dropDownShoppingCartItemContainer}>
					<div className={styles.itemNamePrice}>
						<Link className={styles.link} to={{ pathname: `/product/${product.id}` }}>
							<div className={styles.name}>
								{product.name}
								{product.brand}
							</div>
						</Link>
						<div className={styles.price}>{this.getProductPrice(product.prices).toFixed(2)}</div>
					</div>

					<div className={styles.itemQuantity}>
						<div>
							<button onClick={() => this.increment(1)} className={styles.buttonQuantity}>
								+
							</button>
						</div>
						<div>{this.props.amount}</div>
						<div>
							<button onClick={() => this.increment(-1)} className={styles.buttonQuantity}>
								-
							</button>
						</div>
					</div>
					<div className={styles.itemImage}>
						{product?.gallery?.map((photo) => {
							if (count === 0) {
								count += 1;
								return <img key={product.name} className={styles.image} src={photo} alt={product.name}/>;
							}
							return null;
						})}
					</div>
				</div>
			</div>
		);
	}
}