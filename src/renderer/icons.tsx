import * as React from 'react'

export const Icon: React.SFC<{ size: number; style: React.CSSProperties }> = ({
  size = 24,
  style = {},
  children,
}) => (
  <svg
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    style={{
      width: size,
      height: size,
      fill: 'currentColor',
      verticalAlign: 'middle',
      ...style,
    }}
  >
    {children}
  </svg>
)

export const AddToPhotos: React.SFC<{
  size: number
  style: React.CSSProperties
}> = ({ size, style }) => (
  <Icon size={size} style={style}>
    <g>
      <path d="M4 6h-2v14c0 1.1.9 2 2 2h14v-2h-14v-14zm16-4h-12c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4h-4v-2h4v-4h2v4h4v2z" />
    </g>
  </Icon>
)
