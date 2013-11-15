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
    twoCols int
    twoRows int
    lastCol int
    lastColMinus int
    lastRow int
    lastRowMinus int
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
    graph.lastCol = lastCol
    graph.lastColMinus = lastCol - 1
    graph.lastRow = lastRow
    graph.lastRowMinus = lastRow - 1
    graph.twoCols = cols * 2
    graph.twoRows = rows * 2
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
    fromRow := g.rowCol[from].row
    fromCol := g.rowCol[from].col
    toRow := g.rowCol[to].row
    toCol := g.rowCol[to].col

	if fromRow < toRow { // moving down
        if p.Peek() == to - g.Cols && toRow > 1 { // if low enough and double down movement
            if toCol > 1 { // check left
                if !p.Contains(to-g.Cols-1) && to-g.Cols-1 != endIdx {
                    if p.Contains(to-g.twoCols) &&
                        p.Contains(to-g.twoCols-1) &&
                        p.Contains(to-g.twoCols-2) &&
                        p.Contains(to-g.Cols-2) &&
                        p.Contains(to-2) {
                        return false
                    }
                }
            }
            if toCol < g.lastColMinus { // check right
                if !p.Contains(to-g.Cols+1) && to-g.Cols+1 != endIdx {
                    if p.Contains(to-g.twoCols) &&
                        p.Contains(to-g.twoCols+1) &&
                        p.Contains(to-g.twoCols+2) &&
                        p.Contains(to-g.Cols+2) &&
                        p.Contains(to+2) {
                        return false
                    }
                }
            }
		}
	} else if fromRow > toRow { // moving up
        if p.Peek() == to + g.Cols && toRow < g.Rows - 2 { // if high enough and double up movement
            if toCol > 1 { // check left
                if !p.Contains(to+g.Cols-1) && to+g.Cols-1 != endIdx {
                    if p.Contains(to+g.twoCols) &&
                        p.Contains(to+g.twoCols-1) &&
                        p.Contains(to+g.twoCols-2) &&
                        p.Contains(to+g.Cols-2) &&
                        p.Contains(to-2) {
                        return false
                    }
                }
            }
            if toCol < g.lastColMinus { // check right
                if !p.Contains(to+g.Cols+1) && to+g.Cols+1 != endIdx {
                    if p.Contains(to+g.twoCols) &&
                        p.Contains(to+g.twoCols+1) &&
                        p.Contains(to+g.twoCols+2) &&
                        p.Contains(to+g.Cols+2) &&
                        p.Contains(to+2) {
                        return false
                    }
                }
            }
		}
	} else if fromCol < toCol { // move right
        if p.Peek() == to - 1 && toCol > 1 { // if right enough and double right movement
            if toRow > 1 { // check up
                if !p.Contains(to-g.Cols-1) && to-g.Cols-1 != endIdx {
                    if p.Contains(to-2) &&
                        p.Contains(to-2-g.Cols) &&
                        p.Contains(to-2-g.twoCols) &&
                        p.Contains(to-1-g.twoCols) &&
                        p.Contains(to-g.twoCols) {
                        return false
                    }
                }
            }
            if toRow < g.lastRowMinus { // check down
                if !p.Contains(to+g.Cols-1) && to+g.Cols-1 != endIdx {
                    if p.Contains(to-2) &&
                        p.Contains(to-2+g.Cols) &&
                        p.Contains(to-2+g.twoCols) &&
                        p.Contains(to-1+g.twoCols) &&
                        p.Contains(to+g.twoCols) {
                        return false
                    }
                }
            }
		}
	} else { // moving left
        if p.Peek() == to + 1 && toCol < g.lastColMinus { // if left enough and double left movement
            if toRow > 1 { // check up
                if !p.Contains(to-g.Cols+1) && to-g.Cols+1 != endIdx {
                    if p.Contains(to+2) &&
                        p.Contains(to+2-g.Cols) &&
                        p.Contains(to+2-g.twoCols) &&
                        p.Contains(to+1-g.twoCols) &&
                        p.Contains(to-g.twoCols) {
                        return false
                    }
                }
            }
            if toRow < g.lastRowMinus { // check down
                if !p.Contains(to+g.Cols+1) && to+g.Cols-1 != endIdx {
                    if p.Contains(to+2) &&
                        p.Contains(to+2+g.Cols) &&
                        p.Contains(to+2+g.twoCols) &&
                        p.Contains(to+1+g.twoCols) &&
                        p.Contains(to+g.twoCols) {
                        return false
                    }
                }
            }
		}
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
