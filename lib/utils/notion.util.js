
function unwrapValue(obj) {
  if (!obj) return obj

  if (obj?.value?.value?.id && obj?.value?.role) {
    return obj.value.value
  }

  if (obj?.value?.id && obj?.role !== undefined) {
    return obj.value
  }

  if (obj?.value?.id) {
    return obj.value
  }

  return obj?.value ?? obj
}

/**
 * Notion 数据格式清理工具
 * 旧版 block:{ value:{} }
 * 新版 block:{ spaceId:{ id:{ value:{} } } }
 * 强制解包成旧版
 * @param {*} blockMap
 * @returns
 */
export function adapterNotionBlockMap(blockMap) {
  if (!blockMap) return blockMap

  const cleanedBlocks = {}
  const cleanedCollection = {}

  for (const [id, block] of Object.entries(blockMap.block || {})) {
    cleanedBlocks[id] = { value: unwrapValue(block) }
  }

  for (const [id, collection] of Object.entries(blockMap.collection || {})) {
    cleanedCollection[id] = { value: unwrapValue(collection) }
  }

  return {
    ...blockMap,
    block: cleanedBlocks,
    collection: cleanedCollection
  }
}

export function unwrapNotionValue(obj) {
  return unwrapValue(obj)
}
