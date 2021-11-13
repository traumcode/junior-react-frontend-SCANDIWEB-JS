import React from "react";
import { LOAD_CATEGORIES_AND_CURRENCY } from "../graphQL/Queries";
import { Link } from "react-router-dom";
import styled from "styled-components";
import styles from "./Header.module.css";
import { currencyToSign, setMainStorage } from "../app/App";
import { getDistinctIDs as GetDistinctIDs } from "../utils/GetData";
import { ReactComponent as BrandSvg } from "../resources/brand.svg";
import { ReactComponent as CartSvg } from "../resources/cart.svg";


const Head = styled.div`
  height: 80px;
  background-color: #ffffff;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  margin: 0;
`;

const CategoryButton = styled.button`
  all: unset;
  position: static;
  height: 20px;
  left: 0;
  right: 0;

  font-style: normal;
  font-size: 16px;
  line-height: 19.2px;

  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 30px 0;
  cursor: pointer;
`;

export default class Header extends React.PureComponent {
   constructor(props) {
	 super(props);
	 this.state = {
	    categories: [],
	    currencies: [],
	    currenciesMenuIsOpen: false,
	    miniCartIsOpen: false,
	    symbols: [ "$", "£", "$", "¥", "₽" ],
	    prices: {}
	 }
   }
   _isMounted = false;

   componentDidMount() {
	 this._isMounted = true;
	 this.getCategories();
   }

   getCategories() {
	 this.props.client.query({ query: LOAD_CATEGORIES_AND_CURRENCY }).then((result) => {
	    if (this._isMounted) {
		  let categoryNames = [];
		  let currencies = [];
		  result.data.currencies.map((currency) => currencies.push(currency))
		  result.data.category.products.map((product) => categoryNames.push(product["category"]))
		  this.setState({
			...this.state,
			categories: [ ...new Set(categoryNames) ],
			currencies: currencies
		  })
	    }
	 }).catch((error) => console.error(error));
   }

   componentWillUnmount() {
	 this._isMounted = false;
   }

   render() {
	 return (
	    <div>
		  <Head>
			<nav className={styles.navigation} onClick={() => this.props.setShow(null)}>
			   <div className={styles.category}>
				 <div className={this.props.mainStorage.category === "home" ? styles.categoryButtonFocus : styles.categoryButton}>
				    <Link className={styles.link} to={{ pathname: "/" }}>
					  <CategoryButton
						onClick={() => {
						   setMainStorage({ category: "home" });
						   this.props.setShow(null);
						}}>
						HOME
					  </CategoryButton>
				    </Link>
				 </div>
				 {this.state.categories.map((category, index) => {
				    return (
					  <div
						key={index}
						className={this.props.mainStorage.category === category ? styles.categoryButtonFocus : styles.categoryButton}
					  >
						<Link className={styles.link} to={{ pathname: `/category/${category}` }}>
						   <CategoryButton
							 onClick={() => {
							    setMainStorage({ category: category });
							    this.props.setShow(null);
							 }}>
							 {category.toUpperCase()}
						   </CategoryButton>
						</Link>
					  </div>
				    )
				 })}
			   </div>
			</nav>
			<div className={styles.logoContainer} onClick={() => this.props.setShow(null)}>
			   <BrandSvg/>
			</div>
			<div className={styles.shoppingCartAndCurrencyContainer}>
			   <div className={styles.smallContainer}>
				 <div className={styles.currencyButtonContainer}>
				    <div>
					  <button className={styles.currencyButton}
							onClick={() => {
							   this.props.show !== "currency" ?
								 this.props.setShow("currency") :
								 this.props.setShow(null)

							}}>
						<h3 className={styles.currencySymbol}>{currencyToSign[this.props.mainStorage.currency] || "$"}</h3>
					  </button>
					  {this.props.show === "currency" ? (
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
					  ) : (
						""
					  )}
				    </div>
				    <div
					  onClick={() => {
						this.props.setShow(this.props.show === "cart" ? null : "cart");
						setMainStorage({ isCartMode: true })
					  }}
					  className={styles.shoppingCartButtonContainer}
				    >
					  <button className={styles.shoppingCartButton}>
						<CartSvg/>
						<span className={styles.totalItems}>{GetDistinctIDs().size}</span>
					  </button>
				    </div>
				 </div>
			   </div>
			</div>
		  </Head>
		  {this.props.show === "cart" ? (

			/* AICI TREBUIE SA ADAUGI PRODUSELE*/

			this.props.mainStorage ? (
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

			) : (
			   <div className={styles.dropDownShoppingCart}>
				 <div className={styles.dropDownShoppingCartTitle}>
				    <h3>0 items</h3>
				 </div>
			   </div>
			)
		  ) : (
			""
		  )}
	    </div>
	 )
   }
}
