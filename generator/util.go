package main

import (
	//"fmt"
)

// row and col are 0 based
func getGridRowColFromIdx(idx, cols int) (row, col int) {
	row = idx / cols
	col = idx % cols
	return
}

func isHamiltonianPath(start, end int, graph Graph, stack *Stack) bool {
	//fmt.Printf("Testing path: %+v\n", stack.GetArray())
	//fmt.Printf("Testing count: %d\n", stack.Count())
	if stack.Count() != graph.NumNodes() {
		//fmt.Printf("Failed count\n")
		return false
	}
	if start != stack.Bottom() {
        //fmt.Printf("Testing path: %+v\n", stack.GetArray())
		//fmt.Printf("Failed start: start:%d path:%d\n", start, stack.Bottom())
		return false
	}
	if end != stack.Peek() {
        //fmt.Printf("Testing path: %+v\n", stack.GetArray())
		//fmt.Printf("Failed end: end:%d path:%d\n", end, stack.Peek())
		return false
	}

	return true
}
