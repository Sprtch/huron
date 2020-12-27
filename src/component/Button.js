import React, { useState } from "react";
import { Button, Tooltip } from "reactstrap";

export const RefreshButton = ({ refresh, children }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  return (
    <>
      <Button color="secondary" onClick={refresh} id="Tooltip-refresh">
        ↻
      </Button>
      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        target="Tooltip-refresh"
        toggle={toggleTooltip}
      >
        {children}
      </Tooltip>
    </>
  );
};
