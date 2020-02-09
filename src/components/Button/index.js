import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Button = ({ className, children, onClick }) => (
	<button className={className} type="button" onClick={onClick}>
		{children}
	</button>
);

Button.propTypes = {
	className: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
	onClick: PropTypes.func.isRequired,
};

export default styled(Button)`
	display: block;
	margin: 20px auto;
	cursor: pointer;
	background-color: #1e87f0;
	color: #fff;
	border: 1px solid transparent;
	border: none;
	-webkit-appearance: none;
	border-radius: 2px;
	box-sizing: border-box;
	padding: 0 30px;
	font-size: 14px;
	line-height: 38px;
	text-align: center;
	text-decoration: none;
	text-transform: uppercase;
	transition: 0.1s ease-in-out;
	transition-property: color, background-color, border-color;

	&:hover {
		background-color: #0f7ae5;
		color: #fff;
	}
`;
