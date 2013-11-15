package main

import (
	"fmt"
    "flag"
)

type Problem struct {
	Graph  *GridGraph
	Start  int
	End    int
	Solves int
	Skips int
}

func findHamiltonianPath(prob *Problem, startIdx, endIdx int, p *Path) error {
	p.Push(startIdx)
	for _, next := range prob.Graph.GetAdjs(startIdx) {
		if p.set[next] == 1 {
			//fmt.Printf("Skipping %d, already in path\n", next)
			continue
		}
		/*if !prob.Graph.CanMove(startIdx, next, endIdx, p) {
			//fmt.Printf("Can't move from %d to %d\n", startIdx, next)
            //prob.Skips++
			continue
		}*/

		if next == endIdx {
			p.Push(next)
	//		if isHamiltonianPath(prob.Start, prob.End, prob.Graph, p) {
				prob.Solves++
				//fmt.Printf("%d\n", p.Solves)
				//fmt.Printf("Solution found:\n%+v\n", p.GetArray())
		//	}
			p.Pop()
		} else {
			findHamiltonianPath(prob, next, endIdx, p)
		}
	}
	p.Pop()

	return nil
}

var rows, cols, start, end  int

func init() {
    flag.IntVar(&rows, "r", 6, "rows")
    flag.IntVar(&cols, "c", 6, "cols")
    flag.IntVar(&start, "s", 0, "start")
    flag.IntVar(&end, "e", 34, "end")
    flag.Parse()
}

func main() {
	graph := NewGridGraph(rows, cols)
	p := NewPath(graph.NumNodes())
	prob := &Problem{Graph: graph, Start: start, End: end}
	testFindHamiltonianPath(prob, graph, prob.Start, prob.End, p)
	fmt.Printf("# solves: %d\n", prob.Solves)
	//fmt.Printf("# skips: %d\n", prob.Skips)
}
