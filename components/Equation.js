import * as React from 'react'

import Katex from '@/components/KatexReact'
import { getBlockTitle } from 'notion-utils'

const katexSettings = {
  throwOnError: false,
  strict: false
}

/**
 * 数学公式
 * @param {} param0
 * @returns
 */
export const Equation = ({ block, math, inline = false, className, ...rest }) => {
  math = math || getBlockTitle(block, null)
  if (!math) return null

  const Tag = inline ? 'span' : 'div'

  return (
    <Tag
      className={`notion-equation ${inline ? 'notion-equation-inline' : 'notion-equation-block'} ${className || ''}`.trim()}
    >
      <Katex math={math} settings={katexSettings} {...rest} />
    </Tag>
  )
}
