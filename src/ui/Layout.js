import React from "react";
import Header from "./Header";


export default class Layout extends React.Component {
   state = {
	 show: null
   }

   render() {
	 return (
	    <div>
		  <Header mainStorage={this.props.mainstorage} client={this.props.client} show={this.state.show} setShow={(show) => this.setState({ show })}/>
		  <main style={{ position: "relative", zIndex: 0 }}>
			<div
			   onClick={() => this.setState({ show: null })}
			   style={this.state.show ? {
				 position: "absolute",
				 height: "100px",
				 width: "100px",
				 inset: "0",
				 zIndex: 1,
				 backgroundColor: this.state.show === "currency" ? "transparent" : "rgba(57, 55, 72, 0.22)"
			   } : {}}/>
			<div>{this.props.children}</div>
		  </main>
	    </div>
	 );
   }
}
