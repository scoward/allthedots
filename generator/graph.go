package main

import (
//"fmt"
)

type Graph interface {
	GetAdjs(index int) []int
	AddAdj(from, to int)    // err
	RemoveAdj(from, to int) // err
	NumNodes() int
	CanMove(from, to, endIdx int, p *Path) bool
}

type GridGraph struct {
	Num      int
	Rows     int
	Cols     int
	adj      [][]int
	adjShort [][]int
	rowCol   []*RowCol
}

type RowCol struct {
	row int
	col int
}

func NewGridGraph(rows, cols int) *GridGraph {
	num := rows * cols
	adj := make([][]int, num)
	adjShort := make([][]int, num)
	rowCol := make([]*RowCol, num)
	lastCol := cols - 1
	lastRow := rows - 1
	for idx, _ := range adj {
		adj[idx] = make([]int, num)
		adjShort[idx] = make([]int, 0)
		x := idx % cols
		y := idx / cols
		rowCol[idx] = &RowCol{y, x}
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
	graph := GridGraph{Rows: rows, Cols: cols, Num: num, adj: adj, adjShort: adjShort, rowCol: rowCol}
	/**for i, array := range adjShort {
		fmt.Printf("%d: %+v\n", i, array)
	}*/
	return &graph
}

func (g *GridGraph) GetRowCol(idx int) (row, col int) {
	rowcol := g.rowCol[idx]
	return rowcol.row, rowcol.col
}

// TODO: presets, should be in graph
// to and from are indexes, need to convert to row/col
func (g *GridGraph) CanMove(from, to, endIdx int, p *Path) bool {
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

}

func (g *GridGraph) NumNodes() int {
	return g.Num
}
