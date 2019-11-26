import React, { isValidElement, CSSProperties, FC } from 'react'

const ratioToPercentage = (ratio: number) => Math.round((100 / ratio) * 100) / 100
const percentageString = (ratio: number) => `${ratioToPercentage(ratio)}%`

const innerStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
}

const mergeStyle = (
  children: React.ReactNode,
  style: CSSProperties,
) => {
  if (isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      style: {
        ...children.props.style,
        ...style,
      }
    })
  }
  return children
}

interface AspectedComponentProps {
  ratio?: number
  style?: CSSProperties
}

export const withAspectRatio = (ratio?: number) =>
  <P extends {}>(Component: React.ComponentType<P>): FC<P & AspectedComponentProps> => {
    const beforehandResolveRatio = ratio ? percentageString(ratio) : null
    return ({
      ratio: dynamicRatio,
      children,
      style,
      ...otherProps
    }) => {
      const resolvedRatio = (dynamicRatio ? percentageString(dynamicRatio) : null) || beforehandResolveRatio || null
      const baseStyle: CSSProperties = style ? style : {}
      const resolvedStyle = resolvedRatio ? { ...baseStyle, paddingBottom: resolvedRatio } : baseStyle
      const mergedChildren = mergeStyle(children, innerStyle)
      // https://github.com/Microsoft/TypeScript/issues/28938
      const resolvedOtherProps = otherProps as P

      return (
        <Component
          style={resolvedStyle}
          {...resolvedOtherProps}
        >
          {mergedChildren}
        </Component>
      )
    }
  }
