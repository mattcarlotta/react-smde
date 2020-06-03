import React from "react";
import PropTypes from "prop-types";
import Tooltip from "~components/Tooltip";
import ToolbarItem from "~components/ToolbarItem";
import { classNames } from "~utils";

export const ToolbarButton = ({
	buttonContent,
	buttonProps,
	classes,
	disabled,
	onClick,
	name,
	tooltip,
	tooltipPlacement,
	value,
}) => {
	const button = (
		<button
			type="button"
			tabIndex="0"
			className={classNames({ disabled })}
			data-name={name}
			data-value={value}
			disabled={disabled}
			onClick={onClick}
			{...buttonProps}
		>
			{buttonContent}
		</button>
	);

	return (
		<ToolbarItem className={classNames(classes.mdetoolbaritem)}>
			{tooltip ? (
				<Tooltip
					disabled={disabled}
					className={classes.mdetooltip}
					placement={tooltipPlacement}
					overlay={tooltip}
				>
					{button}
				</Tooltip>
			) : (
				button
			)}
		</ToolbarItem>
	);
};

ToolbarButton.defaultProps = {
	buttonProps: {},
};

ToolbarButton.propTypes = {
	buttonContent: PropTypes.node.isRequired,
	buttonProps: PropTypes.objectOf(
		PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.func,
			PropTypes.number,
			PropTypes.string,
		]),
	),
	classes: PropTypes.objectOf(PropTypes.string),
	disabled: PropTypes.bool,
	onClick: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	tooltip: PropTypes.string,
	tooltipPlacement: PropTypes.string.isRequired,
	value: PropTypes.string,
};

export default ToolbarButton;
