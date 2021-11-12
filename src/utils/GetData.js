export const getDistinctIDs = () => {
   const d = JSON.parse(window.localStorage.getItem("mainStorage"))
   let currency = d?.currency;
   let distinctIds = new Set(this?.props.mainStorage.cartProducts?.map(id => id.id))
   return {
	 size: distinctIds.size,
      currency: currency
   }
}