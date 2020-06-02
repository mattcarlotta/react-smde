import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

export const NoSuggestions = ({ className }) => (
	<li className={className}>No results</li>
);

NoSuggestions.propTypes = {
	className: PropTypes.string.isRequired,
};

export default styled(NoSuggestions)`
	text-align: center;
	color: #a3a3a3;
	height: 28px;
	margin-top: 2px;

	&:hover {
		color: #a3a3a3;
		background-color: #fff;
	}
`;
