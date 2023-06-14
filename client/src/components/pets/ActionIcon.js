import React from "react";

const ActionIcon = ({ iconClass, action, disabled }) => (
  <i
    className={`fas ${iconClass} action-icon ${disabled ? "disabled" : ""}`}
    onClick={disabled ? null : action}
  ></i>
);

export default ActionIcon;
