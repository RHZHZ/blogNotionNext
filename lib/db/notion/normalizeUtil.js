
/**
 * 深度归一化 Notion recordMap 中的包装结构
 * 兼容新版可能出现的 spaceId / role / value / nested map 多层包裹
 */
function unwrapValue(value, maxDepth = 8) {
    let current = value
    let depth = 0

    while (current && depth < maxDepth) {
        if (current.type || current.properties || current.schema || current.collection_id || current.id) {
            return current
        }

        if (current.value && typeof current.value === 'object') {
            current = current.value
            depth++
            continue
        }

        break
    }

    return current ?? null
}

function normalizeMapByValue(input = {}) {
    const result = {}

    Object.entries(input || {}).forEach(([outerKey, outerValue]) => {
        const normalizedOuter = unwrapValue(outerValue)

        if (
            normalizedOuter &&
            typeof normalizedOuter === 'object' &&
            !Array.isArray(normalizedOuter) &&
            !normalizedOuter.type &&
            !normalizedOuter.properties &&
            !normalizedOuter.schema &&
            !normalizedOuter.collection_id &&
            !normalizedOuter.id &&
            !normalizedOuter.role &&
            Object.keys(normalizedOuter).length > 0
        ) {
            Object.entries(normalizedOuter).forEach(([innerKey, innerValue]) => {
                const normalizedInner = unwrapValue(innerValue)
                if (normalizedInner) {
                    result[innerKey] = { value: normalizedInner }
                }
            })
            return
        }

        if (normalizedOuter) {
            result[outerKey] = { value: normalizedOuter }
        }
    })

    return result
}

function normalizeCollectionQuery(input = {}) {
    const result = {}

    Object.entries(input || {}).forEach(([collectionId, views]) => {
        const normalizedViews = unwrapValue(views)
        result[collectionId] = {}

        Object.entries(normalizedViews || {}).forEach(([viewId, payload]) => {
            result[collectionId][viewId] = unwrapValue(payload) || payload
        })
    })

    return result
}

/**
 * 可能由于Notion接口升级导致数据格式变化，这里进行统一处理
 * @param {*} block 
 * @param {*} pageId 
 * @returns 
 */
function normalizeNotionMetadata(block, pageId) {
    const rawValue = block?.[pageId]?.value || block?.[pageId]
    return unwrapValue(rawValue)
}

/**
 * 兼容新老 Notion collection 结构 ， 新版会用space_id 包裹一层
 * 统一返回真正的 collection.value（包含 schema 的那一层）
 */
function normalizeCollection(collection) {
    let current = collection

    // 最多剥 6 层，防止死循环
    for (let i = 0; i < 6; i++) {
        if (!current) break

        // 已经是最终形态：有 schema
        if (current.schema) {
            return current
        }

        // 常见包装：{ value: {...}, role }
        if (current.value && typeof current.value === 'object') {
            current = current.value
            continue
        }

        break
    }

    return current ?? {}
}

/**
 * 兼容 Notion schema
 * 保留原始字段 id 作为 key
 */
function normalizeSchema(schema = {}) {
    const result = {}

    Object.entries(schema).forEach(([key, value]) => {
        result[key] = {
            ...value,
            name: value?.name || '',
            type: value?.type || ''
        }
    })

    return result
}

/**
 * ✅ 终极版：兼容 Notion 新老 Page Block 结构
 * 最终一定返回：{ id, type, properties }
 */
function normalizePageBlock(blockItem) {
    if (!blockItem) return null

    let current = blockItem

    for (let i = 0; i < 8; i++) {
        if (!current) return null

        // 针对 collection 兼容
        if (
            (current.type === 'collection_view_page' || current.type === 'collection_view') &&
            current.collection_id
        ) {
            return current
        }

        if (current.type || current.properties || current.content) {
            return current
        }

        if (current.value && typeof current.value === 'object') {
            current = current.value
            continue
        }

        break
    }

    return null
}

module.exports = {
    unwrapValue,
    normalizeMapByValue,
    normalizeCollectionQuery,
    normalizeNotionMetadata,
    normalizeCollection,
    normalizeSchema,
    normalizePageBlock
}
