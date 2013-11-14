package main

import (
	"fmt"
)

type Problem struct {
	Graph  Graph
	Start  int
	End    int
	Solves int
}

func findHamiltonianPath(prob *Problem, startIdx, endIdx int, p *Path) error {
	p.Push(startIdx)
	for _, next := range prob.Graph.GetAdjs(startIdx) {
		if p.Contains(next) {
			//fmt.Printf("Skipping %d, already in path\n", next)
			continue
		}
		if !prob.Graph.CanMove(startIdx, next, p) {
			fmt.Printf("Can't move from %d to %d\n", startIdx, next)
			continue
		}

		if next == endIdx {
			p.Push(next)
			if isHamiltonianPath(prob.Start, prob.End, prob.Graph, p) {
				prob.Solves++
				//fmt.Printf("%d\n", p.Solves)
				//fmt.Printf("Solution found:\n%+v\n", p.GetArray())
			}
			p.Pop()
		} else {
			findHamiltonianPath(prob, next, endIdx, p)
		}
	}
	p.Pop()

	return nil
}

func main() {
	numRows := 6
	numCols := 6

	graph := NewGridGraph(numRows, numCols)
	prob := &Problem{Graph: graph, Start: 0, End: 34}
	p := NewPath(graph.NumNodes())
	err := findHamiltonianPath(prob, prob.Start, prob.End, p)
	if err != nil {
	}
	fmt.Printf("# solves: %d\n", prob.Solves)
}
