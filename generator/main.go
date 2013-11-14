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

func findHamiltonianPath(p *Problem, startIdx, endIdx int, p *Path) error {
	p.Push(startIdx)
	for _, next := range p.Graph.GetAdjs(startIdx) {
		if p.Contains(next) {
			//fmt.Printf("Skipping %d, already in path\n", next)
			continue
		}
		if !p.Graph.CanMove(startIdx, next, p) {
			fmt.Printf("Can't move from %d to %d\n", startIdx, next)
			continue
		}

		if next == endIdx {
			p.Push(next)
			if isHamiltonianPath(p.Start, p.End, p.Graph, p) {
				p.Solves++
				//fmt.Printf("%d\n", p.Solves)
				//fmt.Printf("Solution found:\n%+v\n", p.GetArray())
			}
			p.Pop()
		} else {
			findHamiltonianPath(p, next, endIdx, p)
		}
	}
	p.Pop()

	return nil
}

func main() {
	numRows := 6
	numCols := 6

	graph := NewGridGraph(numRows, numCols)
	p := &Problem{Graph: graph, Start: 0, End: 34}
	s := NewPath(graph.NumNodes())
	err := findHamiltonianPath(p, p.Start, p.End, s)
	if err != nil {
	}
	fmt.Printf("# solves: %d\n", p.Solves)
}
