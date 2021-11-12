export const PICK_CATEGORY = "pickCategory";
export const GET_PRODUCT_DETAILS = "getProductDetails";
export const GET_PRODUCTS = "getProducts";
export const GET_CURRENCY = "getCurrency";
export const GET_CURRENCY_SYMBOL ="getCurrencySymbol";
export const ADD_TO_CART= "addToCart";
export const REMOVE_FROM_CART = "removeFromCart";
export const GET_PRICE_IN_TOTAL = "getPriceInTotal";

export const pickCategory = (value) => ({
   type: PICK_CATEGORY,
   payload: {
	 value: value,
   }
})

export const getProductDetails = (product) => ({
   type: GET_PRODUCT_DETAILS,
   payload: {
	 selectedProduct: product
   }
})

export const getProducts = (products) => ({
   type: GET_PRODUCTS,
   payload: {
	 products: products
   }
})

export const addToCart = (order) => {

   return {
	 type: ADD_TO_CART,
	 payload: {
	    order,

	    quantity: 1
	 }
   }
}

export const removeFromCart = (order) => {
   return {
	 type: REMOVE_FROM_CART,
	 payload: {
	    order,
	    quantity: 1
	 }
   }
}

export const getCurrency = (currency) => ({
   type: GET_CURRENCY,
   payload: {
	 currency: currency
   }
})

export const getCurrencySymbol = (symbol) => ({
   type: GET_CURRENCY_SYMBOL,
   payload: {
	 currencySymbol: symbol
   }
})

export const getPriceInTotal = (price) => ({
   type: GET_PRICE_IN_TOTAL,
   payload: {
	 priceInTotal: price
   }
})