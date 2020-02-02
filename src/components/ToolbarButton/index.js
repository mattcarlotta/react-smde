import React from "react";
import Tooltip from "~components/Tooltip";
import { classNames } from "~utils";

export const ToolbarButton = ({
  buttonContent,
  buttonProps,
  classes,
  onClick,
  disabled,
  name,
  tooltip,
  tooltipPlacement
}) => {
  const button = (
    <button
      type="button"
      tabIndex="0"
      className={disabled ? "disabled" : undefined}
      data-name={name}
      disabled={disabled}
      onClick={onClick}
      {...buttonProps}
    >
      {buttonContent}
    </button>
  );

  return (
    <li className={classNames("mde-header-item", classes.mdeheaderitem)}>
      {tooltip ? (
        <Tooltip
          overlayClassName={classNames("mde-tooltip", classes.mdetooltip)}
          placement={tooltipPlacement}
          trigger={["hover"]}
          overlay={<span>{tooltip}</span>}
        >
          {button}
        </Tooltip>
      ) : (
        button
      )}
    </li>
  );
};

export default ToolbarButton;
