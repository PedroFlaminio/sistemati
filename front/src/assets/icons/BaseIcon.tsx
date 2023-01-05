import React, { ReactNode } from "react";

const BaseIcon = (props: { color: string; pushRight?: boolean; children: ReactNode }) => {
  const { color, pushRight = true, children } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginRight: pushRight ? "20px" : "0", minWidth: 24 }}
    >
      {children}
    </svg>
  );
};

export default BaseIcon;
