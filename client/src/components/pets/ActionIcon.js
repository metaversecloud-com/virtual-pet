import React from "react";

const ActionIcon = ({ id, iconClass, action, disabled, toggleTooltip }) => (
  <>
    <i
      id={id}
      className={`fas ${iconClass} action-icon ${disabled ? "disabled" : ""}`}
      onClick={disabled ? null : action}
      onMouseOver={() => toggleTooltip(id)}
      onMouseOut={() => toggleTooltip(null)}
    ></i>
  </>
);

export default ActionIcon;
