import React from "react";
import PropTypes from "prop-types";
import "~styles/button.scss";

const Button = ({ children, onClick }) => (
	<button className="show-hide-source" type="button" onClick={onClick}>
		{children}
	</button>
);

Button.propTypes = {
	children: PropTypes.node.isRequired,
	onClick: PropTypes.func.isRequired,
};

export default Button;
