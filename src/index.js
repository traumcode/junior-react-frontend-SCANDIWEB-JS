import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import { Provider } from "react-redux";
import persistMainStorage from './persistMainStorage'
const { store } = persistMainStorage();

ReactDOM.render(
	<Provider store={store}>
		<App/>
	</Provider>,
	document.getElementById('root')
);
