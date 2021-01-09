import React, { useState } from "react";
import { Button, Tooltip } from "reactstrap";

export const TooltipButton = ({
  color,
  children,
  disabled,
  onClick,
  tooltip,
  id,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  return (
    <>
      <Button
        color={color}
        disabled={disabled}
        onClick={onClick}
        id={`Tooltip-${id}`}
      >
        {children}
      </Button>
      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        target={`Tooltip-${id}`}
        toggle={toggleTooltip}
      >
        {tooltip}
      </Tooltip>
    </>
  );
};

export const RefreshButton = ({ refresh, children }) => (
  <TooltipButton
    color="secondary"
    onClick={refresh}
    tooltip={children}
    id="refresh"
  >
    ↻
  </TooltipButton>
);
