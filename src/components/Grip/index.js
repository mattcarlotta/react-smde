import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import SvgIcon from "~icons";
import { classNames } from "~utils";

const Grip = ({ className, classes, onMouseDown }) => (
	<div
		data-testid="mde-grip"
		className={classNames(className, classes.mdegrip)}
		onMouseDown={onMouseDown}
	>
		<SvgIcon icon="grip" />
	</div>
);

Grip.propTypes = {
	className: PropTypes.string.isRequired,
	classes: PropTypes.objectOf(PropTypes.string),
	onMouseDown: PropTypes.func.isRequired,
};

export default styled(Grip)`
	border-bottom-left-radius: 8px;
	border-bottom-right-radius: 8px;
	border-left: 1px solid #c8ccd0;
	border-right: 1px solid #c8ccd0;
	border-bottom: 1px solid #c8ccd0;
	background-color: #ececec;
	text-align: center;
	color: #a0a0a0;
	cursor: s-resize;

	& .icon {
		height: 14px;
	}
`;
