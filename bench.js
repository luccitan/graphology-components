/**
 * GRAPHOLOGY BENCHMARK
 */

var Graph = require('graphology'),
    oldSCC = require('./').stronglyConnectedComponents,
    newSCC = require('./').NEWstronglyConnectedComponents,
    dataset = require('./directed1000.json'),
    graph = new Graph(),
    i,
    start, end,
    sumold = 0,
    sumnew = 0,
    N = 100;

for (i = 0, l = dataset.nodes.length; i < l; i++)
      graph.addNode(dataset.nodes[i].id);
for (i = 0, l = dataset.edges.length; i < l; i++) {
    if (graph.hasEdge(dataset.edges[i].source, dataset.edges[i].target))
        continue;
     graph.addDirectedEdge(dataset.edges[i].source, dataset.edges[i].target);
}

for (i = 0; i < N; i++) {
      start = +new Date();
      oldSCC(graph);
      end = +new Date();
      sumold += end - start;

      start = +new Date();
      newSCC(graph);
      end = +new Date();
      sumnew += end - start;
}

console.log(`${N} executions of the function recursion implementation, in ${sumold} ms`);
console.log(`${N} executions of the stack recursion implementation, in ${sumnew} ms`);
console.log(`\t-> Execution time difference : ${(((sumnew - sumold) * 100) / sumold).toFixed(2)}%`);
