package main

import (
    //"fmt"
)

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

func getNumHamPaths(prob *Problem) int {
	solve_channel := make(chan int)
	var solves, numProcs int

	for _, idx := range prob.Graph.GetAdjs(prob.Start) {
		s := new(PairStack)
		s.nodes = make([]*Pair, 1000)
		for i, _ := range s.nodes {
			s.nodes[i] = &Pair{}
		}
		s.nodes[s.count].start = prob.Start
		s.nodes[s.count].next = idx
		s.count++

		p := NewPath(prob.Graph.Num)
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

	return solves
}

func findHamiltonianPathIter(prob *Problem, s *PairStack, endIdx int, p *Path, solves chan<- int) {
	var pair *Pair
    var preset *Preset
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
	oneRowTwoOppCol := g.Cols - 2
	twoRowsOneCol := twoCols + 1
	twoRowsTwoCol := twoCols + 2
	twoRowsOppCol := twoCols - 1
	twoRowsOppTwoCol := twoCols - 2
	lastRowStart := g.Cols * (g.Rows - 1)

	// stacks for tracking left/right/up/down min/maxes
	sxs := &largeSmallStack{nodes: make([]int, g.Cols), vals: make([]int, g.Cols), count: 0, last: -1}
	lxs := &largeSmallStack{nodes: make([]int, g.Cols), vals: make([]int, g.Cols), count: 0, last: -1}
	lys := &largeSmallStack{nodes: make([]int, g.Rows), vals: make([]int, g.Rows), count: 0, last: -1}
	sys := &largeSmallStack{nodes: make([]int, g.Rows), vals: make([]int, g.Rows), count: 0, last: -1}
	var irow, icol int
	for _, idx := range p.nodes {
		irow = g.rowCol[idx].row
		icol = g.rowCol[idx].col
		if sxs.count == 0 || icol < sxs.vals[sxs.last] {
			sxs.nodes[sxs.count] = idx
			sxs.vals[sxs.count] = icol
			sxs.count++
			sxs.last++
		}
		if lxs.count == 0 || icol > lxs.vals[lxs.last] {
			lxs.nodes[lxs.count] = idx
			lxs.vals[lxs.count] = icol
			lxs.count++
			lxs.last++
		}
		if sys.count == 0 || irow < sys.vals[sys.last] {
			sys.nodes[sys.count] = idx
			sys.vals[sys.count] = irow
			sys.count++
			sys.last++
		}
		if lys.count == 0 || irow > lys.vals[lys.last] {
			lys.nodes[lys.count] = idx
			lys.vals[lys.count] = irow
			lys.count++
			lys.last++
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

			if lxs.nodes[lxs.last] == node {
				lxs.count--
				lxs.last--
			}
			if sxs.nodes[sxs.last] == node {
				sxs.count--
				sxs.last--
			}
			if lys.nodes[lys.last] == node {
				lys.count--
				lys.last--
			}
			if sys.nodes[sys.last] == node {
				sys.count--
				sys.last--
			}
			continue
		}

		fromRow := g.rowCol[pair.start].row
		fromCol := g.rowCol[pair.start].col
		toRow := g.rowCol[pair.next].row
		toCol := g.rowCol[pair.next].col
		to := pair.next

		canMove = true
		// first check if we're able to move based on presets
		if prob.Presets.Num > 0 {
			// first check if pair.start was part of a preset.  if so make sure it's allowed to move
			// to pair.next
            if prob.Presets.Set[pair.start] != 0 {
                preset = prob.Presets.Presets[prob.Presets.Set[pair.start] - 1]
            } else if prob.Presets.Set[pair.next] != 0 {
                // if pair.start not in a preset, check if pair.next is able to receive from pair.start
                preset = prob.Presets.Presets[prob.Presets.Set[pair.next] - 1]
                if preset.Directed == true {
                    if preset.Path[0] != pair.next {
                        //fmt.Printf("%d can't move to %d: %+v\n", pair.start, pair.next, *preset)
                        canMove = false
                    }
                } else {
                    if preset.Path[0] != pair.next && preset.Path[len(preset.Path) - 1] != pair.next {
                        //fmt.Printf("%d can't move to %d: %+v\n", pair.start, pair.next, *preset)
                        canMove = false
                    }
                }
            }
		}

		if canMove {
			if fromRow < toRow { // moving down
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

				// THIS NEEDS TO BE LAST
				if canMove {
					if toRow > lys.vals[lys.last] {
						// first check if closed circuit - TODO: changed closed circuit to something more descriptive
						if toRow == lastRow && sys.vals[sys.last] == 0 {
							// just got top and bottom and we didn't have bottom before
							// check if we have the left or right side
							// if not, add to lys
							hasLeftSide := true
							found := false
							// check top
							for i := 0; found == false && i < g.Rows; i++ {
								comp := i * g.Cols
								if p.set[comp] == 0 && pair.next != comp {
									hasLeftSide = false
									found = true
								}
							}

							// check right side if left is missing
							if hasLeftSide == false {
								found = false
								for i := 0; found == false && i < g.Rows; i++ {
									comp := i*g.Cols + lastCol
									if p.set[comp] == 0 && pair.next != comp {
										canMove = false
									}
								}
							}
						}

						if canMove {
							// add the number to lys
							lys.nodes[lys.count] = pair.next
							lys.vals[lys.count] = toRow
							lys.count++
							lys.last++
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

				// THIS NEEDS TO BE LAST
				if canMove {
					if toRow < sys.vals[sys.last] {
						// first check if closed circuit - TODO: changed closed circuit to something more descriptive
						if toRow == 0 && lys.vals[lys.last] == lastRow {
							// just got top and bottom and we didn't have top before
							// check if we have the left or right side
							// if not, add to sys
							hasLeftSide := true
							found := false
							// check top
							for i := 0; found == false && i < g.Rows; i++ {
								comp := i * g.Cols
								if p.set[comp] == 0 && pair.next != comp {
									hasLeftSide = false
									found = true
								}
							}

							// check right side if left is missing
							if hasLeftSide == false {
								found = false
								for i := 0; found == false && i < g.Rows; i++ {
									comp := i*g.Cols + lastCol
									if p.set[comp] == 0 && pair.next != comp {
										canMove = false
									}
								}
							}
						}

						if canMove {
							// add the number to sys
							sys.nodes[sys.count] = pair.next
							sys.vals[sys.count] = toRow
							sys.count++
							sys.last++
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

				// THIS NEEDS TO BE LAST
				if canMove {
					if toCol > lxs.vals[lxs.last] {
						// first check if closed circuit - TODO: changed closed circuit to something more descriptive
						if toCol == lastCol && sxs.vals[sxs.last] == 0 {
							// just got right and left and we didn't have right before
							// check if we have the top or bottom side
							// if not, add to lxs
							hasTopSide := true
							found := false
							// check top
							for i := 0; found == false && i < g.Cols; i++ {
								if p.set[i] == 0 && pair.next != i {
									hasTopSide = false
									found = true
								}
							}

							// check right side if left is missing
							if hasTopSide == false {
								found = false
								for i := 0; found == false && i < g.Cols; i++ {
									comp := lastRowStart + i
									if p.set[comp] == 0 && pair.next != comp {
										//fmt.Printf("Don't have right side\n")
										canMove = false
									}
								}
							}
						}

						if canMove {
							//fmt.Printf("Adding LXS: %d %d\n", pair.next, toCol)
							// add the number to lxs
							lxs.nodes[lxs.count] = pair.next
							lxs.vals[lxs.count] = toCol
							lxs.count++
							lxs.last++
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

				// THIS NEEDS TO BE LAST
				if canMove {
					if toCol < sxs.vals[sxs.last] {
						// first check if closed circuit - TODO: changed closed circuit to something more descriptive
						if toCol == 0 && lxs.vals[lxs.last] == lastCol {
							// just got right and left and we didn't have left before
							// check if we have the top or bottom side
							// if not, add to sxs
							hasTopSide := true
							found := false
							// check top
							for i := 0; found == false && i < g.Cols; i++ {
								if p.set[i] == 0 && pair.next != i {
									hasTopSide = false
									found = true
								}
							}

							// check right side if left is missing
							if hasTopSide == false {
								found = false
								for i := 0; found == false && i < g.Cols; i++ {
									comp := lastRowStart + i
									if p.set[comp] == 0 && pair.next != comp {
										//fmt.Printf("Don't have right side\n")
										canMove = false
									}
								}
							}
						}

						if canMove {
							// add the number to sxs
							sxs.nodes[sxs.count] = pair.next
							sxs.vals[sxs.count] = toCol
							sxs.count++
							sxs.last++
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
				if p.count == prob.Graph.Num && prob.Start == p.nodes[0] && prob.End == p.nodes[p.last] {
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
