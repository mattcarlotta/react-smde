import React from "react";
import PropTypes from "prop-types";
import Separator from "~components/Separator";
import ToolbarButtonGroup from "~components/ToolbarButtonGroup";
import ToolbarDropdown from "~components/ToolbarDropdown";
import ToolbarButton from "~components/ToolbarButton";
import Tooltip from "~components/Tooltip";
import { classNames } from "~utils";
import { SvgIcon } from "~icons";

const { Fragment } = React;

export const Toolbar = ({
	classes,
	commands,
	disablePreview,
	onCommand,
	onTabChange,
	readOnly,
	tab,
	tooltipPlacement,
}) => {
	const isPreviewing = tab === "preview";
	const disabled = isPreviewing ? true : readOnly;
	const hasCommands = commands && commands.length > 0;

	return (
		<div className={classNames("mde-toolbar", classes.mdetoolbar)}>
			{hasCommands &&
				commands.map((commandGroup, i) => (
					<Fragment key={i}>
						<ToolbarButtonGroup classes={classes}>
							{commandGroup.map(props =>
								props.children ? (
									<ToolbarDropdown
										{...props}
										key={props.name}
										buttonContent={props.icon}
										classes={classes}
										commands={props.children}
										onCommand={cmd => onCommand(cmd)}
										disabled={disabled}
										tooltipPlacement={tooltipPlacement}
									/>
								) : (
									<ToolbarButton
										{...props}
										key={props.name}
										buttonContent={props.icon}
										classes={classes}
										onClick={() => onCommand(props.name)}
										disabled={disabled}
										tooltipPlacement={tooltipPlacement}
									/>
								),
							)}
						</ToolbarButtonGroup>
						<Separator classes={classes} />
					</Fragment>
				))}
			{!disablePreview && (
				<Fragment>
					<ul
						className={classNames("mde-toolbar-group", classes.mdetoolbargroup)}
					>
						<li
							className={classNames("mde-toolbar-item", classes.mdetoolbaritem)}
						>
							<Tooltip
								overlayClassName={classNames("mde-tooltip", classes.mdetooltip)}
								placement={tooltipPlacement}
								trigger={["hover"]}
								overlay={
									<span>
										{isPreviewing
											? "Hide Preview (ctrl+0)"
											: "Preview (ctrl+0)"}
									</span>
								}
							>
								<button
									type="button"
									onClick={() =>
										onTabChange(isPreviewing ? "write" : "preview")
									}
								>
									<SvgIcon icon={isPreviewing ? "eye-closed" : "eye-open"} />
								</button>
							</Tooltip>
						</li>
					</ul>
					<Separator classes={classes} />
				</Fragment>
			)}
		</div>
	);
};

Toolbar.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string),
	commands: PropTypes.arrayOf(
		PropTypes.arrayOf(
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
	),
	disablePreview: PropTypes.bool.isRequired,
	onCommand: PropTypes.func,
	onTabChange: PropTypes.func,
	readOnly: PropTypes.bool,
	tab: PropTypes.string,
	tooltipPlacement: PropTypes.string,
};

export default Toolbar;
