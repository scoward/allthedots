package main

import (
//"fmt"
)

func isHamiltonianPath(start, end int, graph Graph, p *Path) bool {
	//fmt.Printf("Testing path: %+v\n", p.GetArray())
	//fmt.Printf("Testing count: %d\n", p.Count())
	if p.Count() != graph.NumNodes() {
		//fmt.Printf("Failed count\n")
		return false
	}
	if start != p.Bottom() {
		//fmt.Printf("Testing path: %+v\n", p.GetArray())
		//fmt.Printf("Failed start: start:%d path:%d\n", start, p.Bottom())
		return false
	}
	if end != p.Peek() {
		//fmt.Printf("Testing path: %+v\n", p.GetArray())
		//fmt.Printf("Failed end: end:%d path:%d\n", end, p.Peek())
		return false
	}

	return true
}
