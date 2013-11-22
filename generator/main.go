package main

import (
	"flag"
	"fmt"

//	"os"
//	"runtime/pprof"
)

type Problem struct {
	Graph  *GridGraph
	Start  int
	End    int
	Solves int
	Skips  int
}

type Pair struct {
	start int
	next  int
}

type PairStack struct {
	nodes []*Pair
	count int
}

type largeSmallStack struct {
	nodes []int
	vals  []int
	count int
	last  int
}

func findHamiltonianPathIter(prob *Problem, s *PairStack, endIdx int, p *Path, solves chan<- int) {
	var pair *Pair
	var canMove bool = true
	var g *GridGraph = prob.Graph
	var numSolves int = 0
	lastCol := g.Cols - 1
	lastRow := g.Rows - 1
	twoCols := g.Cols * 2
	lastColMinus := lastCol - 1
	lastRowMinus := lastRow - 1
	oneRowOneCol := g.Cols + 1
	oneRowTwoCol := g.Cols + 2
	oneRowOppCol := g.Cols - 1
	oneRowTwoOppCol:= g.Cols - 2
	twoRowsOneCol := twoCols + 1
	twoRowsTwoCol := twoCols + 2
	twoRowsOppCol := twoCols - 1
	twoRowsOppTwoCol := twoCols - 2

	sxs := &largeSmallStack{nodes: make([]int, g.Cols), vals: make([]int, g.Cols), count: 0}
	lxs := &largeSmallStack{nodes: make([]int, g.Cols), vals: make([]int, g.Cols), count: 0}
	for _, idx := range p.nodes {
		if sxs.count == 0 || idx < sxs.nodes[sxs.last] {
			sxs.nodes[sxs.count] = idx
			sxs.vals[sxs.count] = g.rowCol[idx].col
			sxs.count++
			sxs.last++
		}
		if lxs.count == 0 || idx > lxs.nodes[lxs.count] {
			lxs.nodes[lxs.count] = idx
			lxs.vals[lxs.count] = g.rowCol[idx].col
			lxs.count++
			lxs.last++
		}
	}

	for {
		if s.count == 0 {
			solves <- numSolves
			return
		}
		// pop
		pair = s.nodes[s.count-1]
		s.count--

		// Using -1 to signal a pop off of the path stack
		if pair.start == -1 {
			node := p.nodes[p.last]
			p.set[node] = 0
			p.count--
			p.last--

			continue
		}

		fromRow := g.rowCol[pair.start].row
		fromCol := g.rowCol[pair.start].col
		toRow := g.rowCol[pair.next].row
		toCol := g.rowCol[pair.next].col
		to := pair.next

		canMove = true
		if fromRow < toRow { // moving down
            // first check if closed circuit - TODO: changed closed circuit to something more descriptive

			if p.nodes[p.last] == to-g.Cols && toRow > 1 { // if low enough and double down movement
				if toCol > 1 { // check left
					if p.set[to-oneRowOneCol] != 1 && to-oneRowOneCol != endIdx {
						if p.set[to-twoCols] == 1 &&
							p.set[to-twoRowsOneCol] == 1 &&
							p.set[to-twoRowsTwoCol] == 1 &&
							p.set[to-oneRowTwoCol] == 1 &&
							p.set[to-2] == 1 {
							canMove = false
						}
					}
				}
				if toCol < lastColMinus { // check right
					if p.set[to-oneRowOppCol] != 1 && to-oneRowOppCol != endIdx {
						if p.set[to-twoCols] == 1 &&
							p.set[to-twoRowsOppCol] == 1 &&
							p.set[to-twoRowsOppTwoCol] == 1 &&
							p.set[to-oneRowTwoOppCol] == 1 &&
							p.set[to+2] == 1 {
							canMove = false
						}
					}
				}
			}
		} else if fromRow > toRow { // moving up
			if p.nodes[p.last] == to+g.Cols && toRow < g.Rows-2 { // if high enough and double up movement
				if toCol > 1 { // check left
					if p.set[to+oneRowOppCol] != 1 && to+oneRowOppCol != endIdx {
						if p.set[to+twoCols] == 1 &&
							p.set[to+twoRowsOppCol] == 1 &&
							p.set[to+twoRowsOppTwoCol] == 1 &&
							p.set[to+oneRowTwoOppCol] == 1 &&
							p.set[to-2] == 1 {
							canMove = false
						}
					}
				}
				if toCol < lastColMinus { // check right
					if p.set[to+oneRowOneCol] != 1 && to+oneRowOneCol != endIdx {
						if p.set[to+twoCols] == 1 &&
							p.set[to+twoRowsOneCol] == 1 &&
							p.set[to+twoRowsTwoCol] == 1 &&
							p.set[to+oneRowTwoCol] == 1 &&
							p.set[to+2] == 1 {
							canMove = false
						}
					}
				}
			}
		} else if fromCol < toCol { // move right
			if p.nodes[p.last] == to-1 && toCol > 1 { // if right enough and double right movement
				if toRow > 1 { // check up
					if p.set[to-oneRowOneCol] != 1 && to-oneRowOneCol != endIdx {
						if p.set[to-2] == 1 &&
							p.set[to-oneRowTwoCol] == 1 &&
							p.set[to-twoRowsTwoCol] == 1 &&
							p.set[to-twoRowsOneCol] == 1 &&
							p.set[to-twoCols] == 1 {
							canMove = false
						}
					}
				}
				if toRow < lastRowMinus { // check down
					if p.set[to+oneRowOppCol] != 1 && to+oneRowOppCol != endIdx {
						if p.set[to-2] == 1 &&
							p.set[to+oneRowTwoOppCol] == 1 &&
							p.set[to+twoRowsOppTwoCol] == 1 &&
							p.set[to+twoRowsOppCol] == 1 &&
							p.set[to+twoCols] == 1 {
							canMove = false
						}
					}
				}
			}
		} else { // moving left
			if p.nodes[p.last] == to+1 && toCol < lastColMinus { // if left enough and double left movement
				if toRow > 1 { // check up
					if p.set[to-oneRowOppCol] != 1 && to-oneRowOppCol != endIdx {
						if p.set[to+2] == 1 &&
							p.set[to-oneRowTwoOppCol] == 1 &&
							p.set[to-twoRowsOppTwoCol] == 1 &&
							p.set[to-twoRowsOppCol] == 1 &&
							p.set[to-twoCols] == 1 {
							canMove = false
						}
					}
				}
				if toRow < lastRowMinus { // check down
					if p.set[to+oneRowOneCol] != 1 && to+oneRowOppCol != endIdx {
						if p.set[to+2] == 1 &&
							p.set[to+oneRowTwoCol] == 1 &&
							p.set[to+twoRowsTwoCol] == 1 &&
							p.set[to+twoRowsOneCol] == 1 &&
							p.set[to+twoCols] == 1 {
							canMove = false
						}
					}
				}
			}
		}

		if canMove {
			// Push to path
			p.nodes[p.count] = pair.next
			p.set[pair.next] = 1
			p.count++
			p.last++

			// Add pop off of path to stack
			s.nodes[s.count].start = -1 // Add pop
			s.count++

			if pair.next == endIdx {
				if p.count == prob.Graph.Num && start == p.nodes[0] && end == p.nodes[p.last] {
					numSolves++
				}
			} else {
				for _, idx := range prob.Graph.adjShort[pair.next] {
					// don't add if already in path
					if p.set[idx] == 1 {
						continue
					} else {
						s.nodes[s.count].start = pair.next
						s.nodes[s.count].next = idx
						s.count++
					}
				}
			}
		}
	}
}

var rows, cols, start, end, numProcs, solves int

func init() {
	flag.IntVar(&rows, "r", 6, "rows")
	flag.IntVar(&cols, "c", 6, "cols")
	flag.IntVar(&start, "s", 0, "start")
	flag.IntVar(&end, "e", 34, "end")
	flag.Parse()
}

func main() {
	/*f, _ := os.Create("gen.cpuprofile")
	pprof.StartCPUProfile(f)
	defer pprof.StopCPUProfile()*/

	solve_channel := make(chan int)

	graph := NewGridGraph(rows, cols)
	prob := &Problem{Graph: graph, Start: start, End: end}
	for _, idx := range prob.Graph.GetAdjs(prob.Start) {
		s := new(PairStack)
		s.nodes = make([]*Pair, 1000)
		for i, _ := range s.nodes {
			s.nodes[i] = &Pair{}
		}
		s.nodes[s.count].start = prob.Start
		s.nodes[s.count].next = idx
		s.count++

		p := NewPath(graph.Num)
		p.nodes[p.count] = prob.Start
		p.set[prob.Start] = 1
		p.count++
		p.last++

		numProcs++

		go findHamiltonianPathIter(prob, s, prob.End, p, solve_channel)
	}

	for numProcs > 0 {
		solves += <-solve_channel
		numProcs--
	}

	fmt.Printf("# solves: %d\n", solves)
	//fmt.Printf("# skips: %d\n", prob.Skips)
}
