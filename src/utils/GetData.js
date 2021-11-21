export const getDistinctIDs = () => {
   const mainStorage = JSON.parse(window.localStorage.getItem("MainStorage"))
   let currency = mainStorage?.currency;
   let distinctIds = new Set(mainStorage?.cartProducts?.map(id => id.id))
   return {
	 size: distinctIds.size,
      currency: currency
   }
}