import React from "react"

import { IconProps } from "types/icon"

const Shield: React.FC<IconProps> = ({
  size = "20",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M10.0002 2.5L16.6669 5V9.58333C16.6669 13.5333 13.8419 17.2333 10.0002 18.3333C6.1585 17.2333 3.3335 13.5333 3.3335 9.58333V5L10.0002 2.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 10L9.16667 11.6667L12.5 8.33333"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Shield
