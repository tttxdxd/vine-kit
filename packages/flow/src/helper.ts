import type { NodeCtor } from './node'

export function getInstance(Node: NodeCtor) {
  return new Node()
}
