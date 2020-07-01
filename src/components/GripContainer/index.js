import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import CharacterLength from "~components/CharacterLength";
import SvgIcon from "~icons";
import { classNames } from "~utils";

const GripContainer = ({
	className,
	classes,
	disableGrip,
	grip,
	maxCharacterLength,
	onMouseDown,
	showCharacterLength,
	value,
}) => (
	<div
		data-testid="mde-grip-container"
		className={classNames(className, classes.mdegrip, "mde-grip-container")}
		onMouseDown={!disableGrip ? onMouseDown : undefined}
	>
		{!disableGrip && !grip && (
			<SvgIcon
				data-testid="mde-grip"
				icon="grip"
				className={classNames(classes.mdegrip, "mde-grip-icon")}
			/>
		)}
		{grip}
		{showCharacterLength && !grip && (
			<CharacterLength
				data-testid="mde-textarea-character-length"
				disableGrip={disableGrip}
				className={classNames(
					classes.mdetextareacharacterlength,
					"mde-textarea-character-length",
				)}
			>
				{value.length}
				{maxCharacterLength && <span>&#47;{maxCharacterLength}</span>}
			</CharacterLength>
		)}
	</div>
);

GripContainer.propTypes = {
	className: PropTypes.string.isRequired,
	classes: PropTypes.objectOf(PropTypes.string),
	disableGrip: PropTypes.bool.isRequired,
	maxCharacterLength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	showCharacterLength: PropTypes.bool,
	onMouseDown: PropTypes.func.isRequired,
	value: PropTypes.string,
};

export default styled(GripContainer)`
	position: relative;
	border-bottom-left-radius: 8px;
	border-bottom-right-radius: 8px;
	border-left: 1px solid #c8ccd0;
	border-right: 1px solid #c8ccd0;
	border-bottom: 1px solid #c8ccd0;
	background-color: #ececec;
	text-align: center;
	color: #a0a0a0;
	cursor: ${({ disableGrip }) => (!disableGrip ? "s-resize" : "default")};
	min-height: 16px;
`;
