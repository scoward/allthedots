package main

func testIsHamiltonianPath(start, end int, graph *GridGraph, p *Path) bool {
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

/*func testFindHamiltonianPath(prob *Problem, g *GridGraph, from, endIdx int, p *Path) {
	p.nodes[p.count] = from
    p.set[from] = 1
	p.count++

	for _, to := range g.adjShort[from] {
		if p.set[to] == 1 {
			//fmt.Printf("Skipping %d, already in path\n", next)
			continue
		}

		fromRow := g.rowCol[from].row
		fromCol := g.rowCol[from].col
		toRow := g.rowCol[to].row
		toCol := g.rowCol[to].col

		if fromRow < toRow { // moving down
			if p.Peek() == to-g.Cols && toRow > 1 { // if low enough and double down movement
				if toCol > 1 { // check left
					if p.set[to-g.Cols-1] != 1 && to-g.Cols-1 != endIdx {
						if p.set[to-g.twoCols] == 1 &&
							p.set[to-g.twoCols-1] == 1 &&
							p.set[to-g.twoCols-2] == 1 &&
							p.set[to-g.Cols-2] == 1 &&
							p.set[to-2] == 1 {
							continue
						}
					}
				}
				if toCol < g.lastColMinus { // check right
					if p.set[to-g.Cols+1] != 1 && to-g.Cols+1 != endIdx {
						if p.set[to-g.twoCols] == 1 &&
							p.set[to-g.twoCols+1] == 1 &&
							p.set[to-g.twoCols+2] == 1 &&
							p.set[to-g.Cols+2] == 1 &&
							p.set[to+2] == 1 {
							continue
						}
					}
				}
			}
		} else if fromRow > toRow { // moving up
			if p.Peek() == to+g.Cols && toRow < g.Rows-2 { // if high enough and double up movement
				if toCol > 1 { // check left
					if p.set[to+g.Cols-1] != 1 && to+g.Cols-1 != endIdx {
						if p.set[to+g.twoCols] == 1 &&
							p.set[to+g.twoCols-1] == 1 &&
							p.set[to+g.twoCols-2] == 1 &&
							p.set[to+g.Cols-2] == 1 &&
							p.set[to-2] == 1 {
							continue
						}
					}
				}
				if toCol < g.lastColMinus { // check right
					if p.set[to+g.Cols+1] != 1 && to+g.Cols+1 != endIdx {
						if p.set[to+g.twoCols] == 1 &&
							p.set[to+g.twoCols+1] == 1 &&
							p.set[to+g.twoCols+2] == 1 &&
							p.set[to+g.Cols+2] == 1 &&
							p.set[to+2] == 1 {
							continue
						}
					}
				}
			}
		} else if fromCol < toCol { // move right
			if p.Peek() == to-1 && toCol > 1 { // if right enough and double right movement
				if toRow > 1 { // check up
					if p.set[to-g.Cols-1] != 1 && to-g.Cols-1 != endIdx {
						if p.set[to-2] == 1 &&
							p.set[to-2-g.Cols] == 1 &&
							p.set[to-2-g.twoCols] == 1 &&
							p.set[to-1-g.twoCols] == 1 &&
							p.set[to-g.twoCols] == 1 {
							continue
						}
					}
				}
				if toRow < g.lastRowMinus { // check down
					if p.set[to+g.Cols-1] != 1 && to+g.Cols-1 != endIdx {
						if p.set[to-2] == 1 &&
							p.set[to-2+g.Cols] == 1 &&
							p.set[to-2+g.twoCols] == 1 &&
							p.set[to-1+g.twoCols] == 1 &&
							p.set[to+g.twoCols] == 1 {
							continue
						}
					}
				}
			}
		} else { // moving left
			if p.Peek() == to+1 && toCol < g.lastColMinus { // if left enough and double left movement
				if toRow > 1 { // check up
					if p.set[to-g.Cols+1] != 1 && to-g.Cols+1 != endIdx {
						if p.set[to+2] == 1 &&
							p.set[to+2-g.Cols] == 1 &&
							p.set[to+2-g.twoCols] == 1 &&
							p.set[to+1-g.twoCols] == 1 &&
							p.set[to-g.twoCols] == 1 {
							continue
						}
					}
				}
				if toRow < g.lastRowMinus { // check down
					if p.set[to+g.Cols+1] != 1 && to+g.Cols-1 != endIdx {
						if p.set[to+2] == 1 &&
							p.set[to+2+g.Cols] == 1 &&
							p.set[to+2+g.twoCols] == 1 &&
							p.set[to+1+g.twoCols] == 1 &&
							p.set[to+g.twoCols] == 1 {
							continue
						}
					}
				}
			}
		}

		if to == endIdx {
            p.nodes[p.count] = to
            p.set[to] = 1
            p.count++

            if p.count == g.Num && start == p.nodes[0] && end == p.nodes[p.count - 1] {
                prob.Solves++
            }

            // pop
            if p.count != 0 {
                node := p.nodes[p.count-1]
                p.set[node] = 0
                p.count--
            }
        } else {
			testFindHamiltonianPath(prob, prob.Graph, to, endIdx, p)
		}
	}
    
    // pop
    if p.count != 0 {
        node := p.nodes[p.count-1]
        p.set[node] = 0
        p.count--
    }
}*/
