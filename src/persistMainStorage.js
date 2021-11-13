import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist"; // defaults to localStorage for web
import { reducer } from "./redux/reducer";
import { createStore } from "redux";



const persist = {
   key: "root",
   storage
}

const persReduce = persistReducer(persist, reducer)

export default function persistMainStorage() {
   let store = createStore(persReduce, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
   let persist = persistStore(store);
   return { store, persist}
}
