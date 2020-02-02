import React from "react";
import ClickHandler from "~components/ClickHandler";
import Tooltip from "~components/Tooltip";
import ToolbarButton from "~components/ToolbarButton";
import { classNames } from "~utils";

const { Fragment } = React;

export const ToolbarDropdown = ({
  buttonContent,
  buttonProps,
  classes,
  commands,
  disabled,
  onCommand,
  tooltip,
  tooltipPlacement
}) => (
  <li className={classNames("mde-toolbar-item", classes.mdetoolbaritem)}>
    <ClickHandler>
      {({ isVisible, closeDropdown, handleClick }) => (
        <Fragment>
          <Tooltip
            overlayClassName={classNames("mde-tooltip", classes.mdetooltip)}
            placement={tooltipPlacement}
            trigger={["hover"]}
            overlay={<span>{tooltip}</span>}
          >
            <button
              type="button"
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
            <ul className={classNames("mde-dropdown", classes.mdedrop)}>
              {commands.map((command, index) => (
                <ToolbarButton
                  key={`header-item${index}`}
                  name={command.name}
                  buttonProps={command.buttonProps}
                  buttonContent={command.icon}
                  classes={classes}
                  onClick={() => {
                    onCommand(command);
                    closeDropdown();
                  }}
                  readOnly={disabled}
                />
              ))}
            </ul>
          ) : null}
        </Fragment>
      )}
    </ClickHandler>
  </li>
);

ToolbarDropdown.defaultProps = {
  buttonProps: {}
};

export default ToolbarDropdown;
