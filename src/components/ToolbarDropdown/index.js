import React from "react";
import PropTypes from "prop-types";
import ClickHandler from "~components/ClickHandler";
import Dropdown from "~components/Dropdown";
import Tooltip from "~components/Tooltip";
import ToolbarButton from "~components/ToolbarButton";
import ToolbarItem from "~components/ToolbarItem";
import { classNames } from "~utils";

const { Fragment } = React;

export const ToolbarDropdown = ({
	buttonContent,
	buttonProps,
	classes,
	commands,
	disabled,
	name,
	onClick,
	onCommand,
	tooltip,
	tooltipPlacement,
}) => (
	<ToolbarItem className={classNames(classes.mdetoolbaritem)}>
		<ClickHandler>
			{({ isVisible, closeDropdown, handleClick }) => (
				<Fragment>
					<Tooltip
						disabled={disabled}
						className={classes.mdetooltip}
						placement={tooltipPlacement}
						overlay={tooltip}
					>
						<button
							type="button"
							data-name={name}
							tabIndex="0"
							className={disabled ? "disabled" : undefined}
							onClick={handleClick}
							disabled={disabled}
							{...buttonProps}
						>
							{buttonContent}
						</button>
					</Tooltip>
					{isVisible ? (
						<Dropdown className={classNames(classes.mdedrop)}>
							{commands.map(({ name, buttonProps, icon, value }) => (
								<ToolbarButton
									key={name}
									name={name}
									buttonProps={buttonProps}
									buttonContent={icon}
									classes={classes}
									onClick={() => {
										if (onClick) {
											onClick(value);
										} else {
											onCommand(name);
										}
										closeDropdown();
									}}
									readOnly={disabled}
									tooltipPlacement={tooltipPlacement}
								/>
							))}
						</Dropdown>
					) : null}
				</Fragment>
			)}
		</ClickHandler>
	</ToolbarItem>
);

ToolbarDropdown.defaultProps = {
	buttonProps: {},
};

ToolbarDropdown.propTypes = {
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
	commands: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			tooltip: PropTypes.string,
			buttonProps: PropTypes.objectOf(
				PropTypes.oneOfType([
					PropTypes.string,
					PropTypes.number,
					PropTypes.func,
				]),
			),
			icon: PropTypes.node,
		}),
	),
	disabled: PropTypes.bool,
	name: PropTypes.string,
	onClick: PropTypes.func,
	onCommand: PropTypes.func.isRequired,
	tooltip: PropTypes.string,
	tooltipPlacement: PropTypes.string.isRequired,
};

export default ToolbarDropdown;
