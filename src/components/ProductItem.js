import React from "react";
import { PRODUCT_BY_ID } from "../graphQL/Queries";
import styles from "./ProductItem.module.css"
import { Link } from "react-router-dom";
import { currencyToSign, setMainStorage } from "../app/App";


export default class ProductItem extends React.Component {
	_isMounted = false;
	downloading = false;

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true
		}
	}

	async componentDidUpdate(prevProps, prevState, snapshot) {
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

	getProductPrice(prices) {
		return prices.find((price) => price.currency === this.props?.mainStorage?.currency)?.amount
	}

	increment = (value: 1 | -1) => {
		const { mainStorage: { cartProducts = [] }, } = this.props;
		const productIndex = this.props.index;
		const product = cartProducts[productIndex];
		product.amount = product.amount + value;
		if (product.amount <= 0) {cartProducts.splice(productIndex, 1)}
		setMainStorage({ cartProducts });
	};

	render() {
		let count = 0;
		const { product } = this.state;

		if (!this.state.product) {
			return null;
		}

		console.log(this.state)

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
						<div className={styles.price}>
							{currencyToSign[`${this.props?.mainStorage?.currency}`]}
							{this.getProductPrice(product.prices)?.toFixed(2)}
						</div>
						<div className={styles.attributesContainer}>
						{this.state?.product.attributes?.map((attribute, aindex) => {
							let activeAttributes = {}
							return (
								<div key={aindex}>
									<div className={styles.productAttributeTitle}>
										<h4>{attribute.name.toUpperCase()}:</h4>
									</div>
									<div className={styles.attributeButtonContainer}>
										{attribute.type === "swatch"
											? attribute?.items.map((item, index) => {
												return (
													<div
														key={index}
														onClick={() => {
															this.setState({
																activeAttributes: {
																	...activeAttributes,
																	[attribute.type]: item.value
																},
															});
														}}
														style={
															item.value === activeAttributes?.[attribute.type]
																? {
																	border: "1px solid black",
																	borderRadius: "50%",
																	height: "20px",
																	width: "20px",
																	marginRight: "10px",
																}
																: {}
														}
													>
														<label>
															<div
																className={styles.attributeValueColorContainer}
																style={{
																	backgroundColor: `${item.value}`,
																	height: "20px",
																	width: "20px",
																	borderRadius: "50%",
																}}
															/>
															<span className={styles.attributeSizeButtonText}/>
														</label>
													</div>
												);
											})
											: attribute?.items.map((item, index) => {
												return (
													<div key={index}>
														<div
															onClick={() => {
																this.setState({
																	activeAttributes: {
																		...activeAttributes,
																		[attribute.name]: item.value
																	},
																});
															}}
															className={styles.attributeValueContainer}
															style={
																item.value === activeAttributes?.[attribute.name] ? {
																	backgroundColor: "black",
																	color: "white"
																} : {}
															}
														>
															<label key={index} htmlFor={this.state.name}>
																<h4 className={styles.attributeSizeButtonText}>{item.displayValue}</h4>
															</label>
														</div>
													</div>
												);
											})}
									</div>
								</div>
							);
						})}
					</div>
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