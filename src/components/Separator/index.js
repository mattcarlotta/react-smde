import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { classNames } from "~utils";

export const Separator = ({ className, classes }) => (
	<i className={classNames(className, classes.mdetoolbarseparator)}>|</i>
);

Separator.propTypes = {
	className: PropTypes.string.isRequired,
	classes: PropTypes.objectOf(PropTypes.string),
};

export default styled(Separator)`
	display: inline-block;
	width: 0;
	border-left: 1px solid #d9d9d9;
	border-right: 1px solid #fff;
	color: transparent;
	text-indent: -10px;
`;
