/**
 * GRAPHOLOGY BENCHMARK
 */

var Graph = require('graphology'),
    oldSCC = require('./').oldSCC,
    newSCC = require('./').newSCC,
    graph = new Graph(),
    i,
    start, end,
    sumold = 0,
    sumnew = 0,
    N = 100000;

graph.addNodesFrom([1, 2, 3, 4, 5, 6, 7, 8]);

graph.addDirectedEdge(1, 2);
graph.addDirectedEdge(2, 3);
graph.addDirectedEdge(3, 1);
graph.addDirectedEdge(3, 4);
graph.addDirectedEdge(4, 5);
graph.addDirectedEdge(5, 4);
graph.addDirectedEdge(6, 7);
graph.addDirectedEdge(7, 8);
graph.addDirectedEdge(8, 6);

for (i = 0; i < N; i++) {
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
