import React, { Component } from "react";
import styles from "./ProductPage.module.css";
import sanitizeHtml from "sanitize-html";
import { getPrice } from "../components/Product";
import { PRODUCT_BY_ID } from "../graphQL/Queries";
import { setMainStorage } from '../app/App'

export default class ProductPage extends Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			modalState: false,
			isLoading: true,
			bigImage: 0,
			activeAttributes: {},
			inCart: 0,
			gallery: ""
		}
	}

	componentDidMount() {
		this._isMounted = true;
		this.fetchData();
	}

	componentDidUpdate() {
		this._isMounted = true;
		this.fetchData();
	}

	getCartProductIndex(activeAttributes, _cartProducts, id) {
		let cartProducts = _cartProducts?.map((v) => ({ ...v })) || [];
		return cartProducts.findIndex((p) => {
			return (
				p.id === id &&
				!Object.keys(p.activeAttributes).find((attributeKey) => p.activeAttributes[attributeKey] !== activeAttributes[attributeKey])
			);
		});
	}

	handlerAddToCart(productId) {
		const { activeAttributes } = this.state;

		if (Object.keys(activeAttributes).length === this.state.attributes.length) {
			const cartProducts = this.props.mainStorage?.cartProducts || []
			const productIndex = this.getCartProductIndex(activeAttributes, this.props.mainStorage?.cartProducts, productId);
			const product = cartProducts?.[productIndex] || {
				id: productId,
				brand:this.state.brand,
				activeAttributes,
				amount: 0,
				prices: this.state.prices,
				name: this.state.name,
				gallery: this.state.gallery
			};
			product.amount++;

			if (productIndex > -1) {
				cartProducts[productIndex] = product
			} else {
				cartProducts.push(product);

			}
			setMainStorage({ cartProducts });
		} else {
			this.setState({ modalState: true });
		}
	}

	fetchData() {
		if(this.props.match.params.id === this.state.id) {
			return
		}
		this.props.client
			.query({
				query: PRODUCT_BY_ID(this.props.match.params.id),
			})
			.then((result) => {
				if (this._isMounted) {
					this.setState(result.data.product);

					/*
					because there is too little information, the fetch is very fast and it is impossible for the loading bar to appear,
					so I put a 2 second timer just to show this beautiful bar

					^_^

					*/
					setTimeout(() => {
						this.setState({ isLoading: false });
					}, 500);
				}
			})
			.catch((err) => console.error(err));
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		let { activeAttributes } = this.state;
		if (this.state.isLoading) return <div className={styles.loadingBar}/>;
		return (
			<div className={styles.productContainer}>
				<div className={styles.productPhotosLeft}>
					{this.state?.gallery?.map((photo, index) => {
						return (
							<img key={index} onClick={() => this.setState({ bigImage: index })} className={styles.smallImage} alt="product" src={photo}/>
						);
					})}
				</div>
				<div className={styles.productPhotoCenter}>
					<img style={{ width: "100%" }} src={this.state.gallery?.[this.state.bigImage]} alt="" className="big-image"/>
				</div>
				<div className={styles.productDetails}>
					<div className={styles.productTitle}>
						<h3>{this.state.name}</h3>
					</div>
					<div className={styles.productBrand}>
						<h3 style={{ fontWeight: 400 }}>{this.state.brand}</h3>
					</div>

					{this.state?.attributes.map((attribute, aindex) => {
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
					<div className={styles.productPriceContainer}>
						<h3 className={styles.productPriceTitle}>PRICE:</h3>
						<h3 className={styles.productPrice}>{getPrice(this.state.prices, this.props.mainStorage.currency)}</h3>
					</div>
					<div className={styles.buttonContainer}>
						{this.state.inStock ? (
							<button
								onClick={() => {
									this.handlerAddToCart(this.state.id);
								}}
								className={styles.buttonCart}
							>
								ADD TO CART
							</button>
						) : (
							<button className={styles.buttonCartOutOfStock}>OUT OF STOCK</button>
						)}
					</div>
					<div className={styles.productInfoContainer}>
						<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(this.state.description) }}/>
					</div>
				</div>
				<div id="myModal" className={styles.modal} style={this.state.modalState === true ? { display: "block" } : { display: "none" }}>
					<div className={styles.modalContent}>
						<div className={styles.modalHeader}>
              <span onClick={() => this.setState({ modalState: false })} className={styles.close}>
                &times;
              </span>
							<h2>Oupsie doupsie..</h2>
						</div>
						<div className={styles.modalBody}>
							<p>Please select all the options first</p>
						</div>
						<div className={styles.modalButtonContainer}>
							<button onClick={() => this.setState({ modalState: false })} className={styles.modalButton}>
								OK
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

