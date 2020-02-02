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
  tooltipPlacement
}) => {
  const isPreviewing = tab === "preview";
  const disabled = isPreviewing ? true : readOnly;
  const hasCommands = commands && commands.length > 0;

  return (
    <div
      style={!hasCommands && disablePreview ? { display: "none" } : {}}
      className={classNames("mde-header", classes.mdeheader)}
    >
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
                    onClick={() => onCommand(props)}
                    disabled={disabled}
                    tooltipPlacement={tooltipPlacement}
                  />
                )
              )}
            </ToolbarButtonGroup>
            <Separator classes={classes} />
          </Fragment>
        ))}
      {!disablePreview && (
        <Fragment>
          <div className={classNames("mde-tabs", classes.mdetabs)}>
            <Tooltip
              overlayClassName={classNames("mde-tooltip", classes.mdetooltip)}
              placement={tooltipPlacement}
              trigger={["hover"]}
              overlay={<span>{isPreviewing ? "Hide Preview" : "Preview"}</span>}
            >
              <button
                type="button"
                onClick={() => onTabChange(isPreviewing ? "write" : "preview")}
              >
                <SvgIcon icon={isPreviewing ? "eye-closed" : "eye-open"} />
              </button>
            </Tooltip>
          </div>
          <Separator classes={classes} />
        </Fragment>
      )}
    </div>
  );
};

Tooltip.propTypes = {
  classes: PropTypes.objectOf(PropTypes.shape),
  commands: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      tooltip: PropTypes.string,
      buttonProps: PropTypes.objectOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.func
        ])
      ),
      icon: PropTypes.node
    })
  ),
  disablePreview: PropTypes.bool,
  onCommand: PropTypes.func,
  onTabChange: PropTypes.func,
  readOnly: PropTypes.bool,
  tab: PropTypes.string,
  tooltipPlacement: PropTypes.string
};

export default Toolbar;
