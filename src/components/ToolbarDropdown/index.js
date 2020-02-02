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
}) => {
  const additionalButtonProps = {
    ...{ tabIndex: 0 },
    ...(buttonProps || {})
  };

  return (
    <li className={classNames("mde-header-item", classes.mdeheaderitem)}>
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
                {...additionalButtonProps}
                className={disabled ? "disabled" : undefined}
                onClick={handleClick}
                disabled={disabled}
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
};

export default ToolbarDropdown;
