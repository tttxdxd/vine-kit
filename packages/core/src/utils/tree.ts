import { groupBy, isString } from ".."

interface TreeNode<T extends Record<string, any>> {
  id: string | number
  parentId: string | number
  label: string
  value: string
  weight: number
  data: T
  children: TreeNode<T>[]
  isLeaf?: boolean
}

interface TreeNodeOptions {
  idKey?: string
  parentIdKey?: string
  weightKey?: string
  labelKey?: string
  valueKey?: string
  childrenKey?: string
  deep?: number
}
type TreeNodeConfig = Required<TreeNodeOptions>

const defaultTreeNodeOptions: TreeNodeConfig = {
  idKey: 'id',
  parentIdKey: 'parentId',
  weightKey: 'weight',
  labelKey: 'label',
  valueKey: 'value',
  childrenKey: 'children',
  deep: 0,
}

export function build<T extends Record<string, any>>(list: T[], parentId: string | number, options?: TreeNodeOptions): TreeNode<T>[] {
  const config = Object.assign({}, defaultTreeNodeOptions, options)
  const parentIdKey = isString(config.parentIdKey) ? config.parentIdKey : config.parentIdKey[0]
  const parentGroupMap = groupBy(list, parentIdKey)
  const children = buildTree(parentGroupMap, parentId, config)

  return children
}

function buildTree<T extends Record<string, any>>(map: Record<string, T[]>, parentId: string | number, config: TreeNodeConfig, depth: number = 0) {
  if (config.deep !== 0 && depth >= config.deep) return []

  const list = map[parentId] ?? []
  const tree: TreeNode<T>[] = list.map(item => {
    const nodeId = item[config.idKey]
    const nodeParentId = item[config.parentIdKey]
    const nodeWeight = item[config.weightKey] ?? 0
    const nodeLabel = item[config.labelKey] ?? nodeId
    const nodeValue = item[config.valueKey] ?? nodeId
    const nodeChildren = buildTree(map, nodeId, config, depth + 1)

    return ({
      id: nodeId,
      parentId: nodeParentId,
      weight: nodeWeight,
      label: nodeLabel,
      value: nodeValue,
      children: nodeChildren,
      isLeaf: nodeChildren.length === 0,
      data: item,
    })
  }).sort((l, r) => l.weight - r.weight)

  return tree
}
