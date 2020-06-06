import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Tooltip from "@material-ui/core/Tooltip";
import Separator from "~components/Separator";
import ToolbarButtonGroup from "~components/ToolbarButtonGroup";
import ToolbarDropdown from "~components/ToolbarDropdown";
import ToolbarButton from "~components/ToolbarButton";
import ToolbarItem from "~components/ToolbarItem";
import { classNames } from "~utils";
import { SvgIcon } from "~icons";

export const Toolbar = ({
	className,
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
		<div className={classNames(className, classes.mdetoolbar)}>
			{hasCommands &&
				commands.map((commandGroup, i) => (
					<React.Fragment key={i}>
						<ToolbarButtonGroup className={classNames(classes.mdetoolbargroup)}>
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
						<Separator className={classNames(classes.mdetoolbarseparator)} />
					</React.Fragment>
				))}
			{!disablePreview && (
				<React.Fragment>
					<ToolbarButtonGroup className={classNames(classes.mdetoolbargroup)}>
						<ToolbarItem className={classNames(classes.mdetoolbaritem)}>
							<Tooltip
								arrow
								classes={{
									arrow: classes.mdetooltiparrow,
									popper: classes.mdetooltippopper,
									popperArrow: classes.mdetooltippopperarrow,
									tooltip: classes.mdetooltip,
									tooltipPlacementBottom: classes.mdetooltipplacementbottom,
									tooltipPlacementLeft: classes.mdetooltipplacementleft,
									tooltipPlacementRight: classes.mdetooltipplacementright,
									tooltipPlacementTop: classes.mdetooltipplacementtop,
									touch: classes.mdetooltiptouch,
								}}
								placement={tooltipPlacement}
								title={
									isPreviewing ? "Hide Preview (ctrl+0)" : "Preview (ctrl+0)"
								}
							>
								<button
									type="button"
									data-name="preview-write"
									onClick={() =>
										onTabChange(isPreviewing ? "write" : "preview")
									}
								>
									<SvgIcon icon={isPreviewing ? "eye-closed" : "eye-open"} />
								</button>
							</Tooltip>
						</ToolbarItem>
					</ToolbarButtonGroup>
					<Separator className={classNames(classes.mdetoolbarseparator)} />
				</React.Fragment>
			)}
		</div>
	);
};

Toolbar.propTypes = {
	className: PropTypes.string.isRequired,
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

export default styled(Toolbar)`
	flex-shrink: 0;
	display: flex;
	flex-wrap: wrap;
	align-items: stretch;
	border-top: 1px solid #c8ccd0;
	border-left: 1px solid #c8ccd0;
	border-right: 1px solid #c8ccd0;
	border-radius: 8px 8px 0 0;
	background: #ececec;
`;
