/**
 * Graphology Components
 * ======================
 *
 * Basic connected components-related functions.
 */
var isGraph = require('graphology-utils/is-graph');

/**
 * Function returning a list of connected components.
 *
 * @param  {Graph} graph - Target graph.
 * @return {array}
 */
exports.connectedComponents = function(graph) {
  if (!isGraph(graph))
    throw new Error('graphology-components: the given graph is not a valid graphology instance.');

  if (!graph.order)
    return [];

  var components = [],
      nodes = graph.nodes(),
      i, l;

  if (!graph.size) {
    for (i = 0, l = nodes.length; i < l; i++) {
      components.push([nodes[i]]);
    }
    return components;
  }

  var component,
      stack = [],
      node,
      neighbor,
      visited = new Set();

  for (i = 0, l = nodes.length; i < l; i++) {
    node = nodes[i];

    if (!visited.has(node)) {
      visited.add(node);
      component = [node];
      components.push(component);

      stack.push.apply(stack, graph.neighbors(node));

      while (stack.length) {
        neighbor = stack.pop();

        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          component.push(neighbor);
          stack.push.apply(stack, graph.neighbors(neighbor));
        }
      }
    }
  }

  return components;
};

/**
 * Function returning a list of strongly connected components.
 *
 * @param  {Graph} graph - Target directed graph.
 * @return {array}
 */
exports.oldSCC = function(graph) {
  if (!isGraph(graph))
    throw new Error('graphology-components: the given graph is not a valid graphology instance.');

  if (!graph.order)
    return [];

  if (graph.type === 'undirected')
    throw new Error('graphology-components: the given graph is undirected');

  var nodes = graph.nodes(),
      components = [],
      i, l;

  if (!graph.size) {
    for (i = 0, l = nodes.length; i < l; i++)
      components.push([nodes[i]]);
    return components;
  }

  var count = 1,
      P = [],
      S = [],
      preorder = new Map(),
      assigned = new Set(),
      component,
      pop,
      vertex;

  var DFS = function(node) {
    var neighbor,
        neighbors = graph.outNeighbors(node).concat(graph.undirectedNeighbors(node)),
        neighborOrder;

    preorder.set(node, count++);
    P.push(node);
    S.push(node);

    for (var k = 0, n = neighbors.length; k < n; k++) {
      neighbor = neighbors[k];

      if (preorder.has(neighbor)) {
        neighborOrder = preorder.get(neighbor);
        if (!assigned.has(neighbor))
          while (preorder.get(P[P.length - 1]) > neighborOrder)
            P.pop();
      }
      else
        DFS(neighbor);
    }

    if (preorder.get(P[P.length - 1]) === preorder.get(node)) {
      component = [];
      do {
        pop = S.pop();
        component.push(pop);
        assigned.add(pop);
      } while (pop !== node);
      components.push(component);
      P.pop();
    }
  };

  for (i = 0, l = nodes.length; i < l; i++) {
    vertex = nodes[i];
    if (!assigned.has(vertex))
      DFS(vertex);
  }

  return components;
};

/**
 * Function returning a list of strongly connected components.
 *
 * @param  {Graph} graph - Target directed graph.
 * @return {array}
 */
exports.newSCC = function(graph) {
  if (!isGraph(graph))
    throw new Error('graphology-components: the given graph is not a valid graphology instance.');
  if (graph.type === 'undirected')
    throw new Error('graphology-components: the given graph is undirected');
  if (!graph.order)
    return [];

  var components = [],
      nodes = graph.nodes(),
      i, l,
      j, l2;

  if (!graph.size) {
    for (i = 0, l = nodes.length; i < l; i++)
      components.push([nodes[i]]);
    return components;
  }

  var count = 1,
      component,
      assigned = {},
      preorder = {},
      P = [],
      S = [],
      recursionStack = [], L1,
      componentFactoryStack = [], L2,
      n, node, pop,
      neighbor, neighbors,
      neighborOrder, neighborStack;

  for (i = 0, l = nodes.length; i < l; i++) {
    if (preorder[nodes[i]])
      continue;

    recursionStack = [nodes[i]];
    while (recursionStack.length > 0) {


      L1 = recursionStack.length - 1;
      L2 = componentFactoryStack.length - 1;

      /**
       * Handling the post-recursion action
       * it will trigger only when no more 'sub-node'
       *   are added to the recursion stack
       * so that both stacks are on the same node
       */
      if (recursionStack[L1] === componentFactoryStack[L2]) {
        n = componentFactoryStack.pop();
        recursionStack.pop();
        if (preorder[P[P.length - 1]] === preorder[n]) {
          component = [];
          do {
            pop = S.pop();
            component.push(pop);
            assigned[pop] = true;
          } while (pop !== n);
          components.push(component);
          P.pop();
        }
        continue;
      }

      node = recursionStack[L1];
      preorder[node] = count++;
      P.push(node);
      S.push(node);
      neighbors = graph.outNeighbors(node).concat(graph.undirectedNeighbors(node));
      neighborStack = [];

      for (j = 0, l2 = neighbors.length; j < l2; j++) {
        neighbor = neighbors[j];

        if (preorder[neighbor]) {
          neighborOrder = preorder[neighbor];
          if (!assigned[neighbor])
            while (preorder[P[P.length - 1]] > neighborOrder)
              P.pop();
        }
        else
          neighborStack.unshift(neighbor);
      }
      recursionStack = recursionStack.concat(neighborStack);
      componentFactoryStack.push(node);
    }
  }

  return components;
};
