package main

import (
	"fmt"
)

type Graph interface {
	GetAdjs(index int) []int
	AddAdj(from, to int)    // err
	RemoveAdj(from, to int) // err
	NumNodes() int
	CanMove(from, to int) bool
}

type GridGraph struct {
	Num      int
	Rows     int
	Cols     int
	adj      [][]int
	adjShort [][]int
}

func NewGridGraph(rows, cols int) Graph {
	num := rows * cols
	adj := make([][]int, num)
	adjShort := make([][]int, num)
	lastCol := cols - 1
	lastRow := rows - 1
	for idx, _ := range adj {
		adj[idx] = make([]int, num)
		adjShort[idx] = make([]int, 0)
		x := idx % cols
		y := idx / cols
		if x != 0 {
			adj[idx][idx-1] = 1
            adjShort[idx] = append(adjShort[idx], idx-1)
		}
		if x < lastCol {
			adj[idx][idx+1] = 1
            adjShort[idx] = append(adjShort[idx], idx+1)
		}
		if y > 0 {
			adj[idx][idx-cols] = 1
            adjShort[idx] = append(adjShort[idx], idx-cols)
		}
		if y < lastRow {
			adj[idx][idx+cols] = 1
            adjShort[idx] = append(adjShort[idx], idx+cols)
		}
	}
	graph := GridGraph{Rows: rows, Cols: cols, Num: num, adj: adj, adjShort: adjShort}
	for i, array := range adjShort {
		fmt.Printf("%d: %+v\n", i, array)
	}
	return &graph
}

// TODO: presets, should be in graph
// to and from are indexes, need to convert to row/col
func (g *GridGraph) CanMove(from, to int) bool {
	fromRow, fromCol := getGridRowColFromIdx(from, g.Cols)
	toRow, toCol := getGridRowColFromIdx(to, g.Cols)

	diffCol := toCol - fromCol
	if diffCol < 0 {
		diffCol = -diffCol
	}
	diffRow := toRow - fromRow
	if diffRow < 0 {
		diffRow = -diffRow
	}
	diff := diffCol + diffRow
	if diff != 1 {
		return false
	}

	return true
}

func (g *GridGraph) GetAdjs(index int) []int {
	return g.adjShort[index]
}

// From and to are vertex indexes
func (g *GridGraph) AddAdj(from, to int) {
	// do nothing atm
}

// From and to are vertex indexes
func (g *GridGraph) RemoveAdj(from, to int) {
	// do nothing atm
}

func (g *GridGraph) NumNodes() int {
	return g.Num
}
