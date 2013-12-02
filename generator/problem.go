package main

import (
	"errors"
	"fmt"
	"math/rand"
)

var MAX_PRESETS_IN_LEVEL int = 5
var MAX_ATTEMPTS = 10

type Problem struct {
	Graph   *GridGraph
	Start   int
	End     int
	Presets *PresetGroup
	Rand    *rand.Rand
	Solves  int
}

func NewProblem(row, cols, start, end int, r *rand.Rand) *Problem {
	graph := NewGridGraph(rows, cols)
	presets := NewPresetGroup(graph.Num, MAX_PRESETS_IN_LEVEL)
	return &Problem{Graph: graph, Start: start, End: end, Presets: presets, Rand: r}
}

// Returns errors:
// 1 no initial solves
// 2 can't generate # presets
// 3 can't generate # presets with sufficient solves
func (p *Problem) Solve() int {
	var attempts int = 0
	//numPrefPresets := generateNumPresets(p.Graph.Rows, p.Graph.Cols, p.Rand)
	// check for initial solves
	solves := getNumHamPaths(p)
	if solves == 0 {
		return 1
	}

	for {
		attempts++
		errNo, _ := p.addNewPreset()
		if errNo == 2 {
			fmt.Printf("ERROR: Could not generate presets\n")
			return 2
		}
		solves = getNumHamPaths(p)
		if solves == 0 {
			if attempts == MAX_ATTEMPTS {
				return 3
			} else {
				p.Presets.removeLastPreset()
			}
		} else {
			if solves < 20 {
				p.Solves = solves
				return 0
			} else {
				if attempts == MAX_ATTEMPTS {
					return 3
				} else if p.Presets.Num == MAX_PRESETS_IN_LEVEL {
					p.Presets.removeLastPreset()
				}
			}
		}
	}
	return 0
}

// Returns error num + regular error
// Error numbers are as follows:
// 1 too many presets
// 2 can't create preset
func (p *Problem) addNewPreset() (int, error) {
	if p.Presets.Num == p.Presets.Max {
		return 1, errors.New("Too many presets in level")
	}

	maxAttempts := p.Graph.Num * 2
	var attempts int = 0
	var presetGenerated bool = false
	var array []int
	var err error

	for attempts < maxAttempts && presetGenerated == false {
		array, err = generatePreset(p.Presets, p.Graph.Rows, p.Graph.Cols, p.Rand)
		if err != nil {
			attempts++
		} else {
			presetGenerated = true
		}
	}

	if presetGenerated == true {
		p.Presets.addPreset(&Preset{Directed: generatePresetPathType(p.Rand), Path: array})
	} else {
		return 2, errors.New("Can't generate new preset on current grid")
	}

	return 0, nil
}

func (p *Problem) isSolveUnique(solves []*Solve) bool {
    var solvePresets []*Preset
    var probPresets []*Preset
	for _, solve := range solves {
        // This check needs to be done here, it is not and should not
        // be done in the doPresetArraysMatch method
		if len(solve.Presets) == p.Presets.Num {
            solvePresets = solve.Presets
            probPresets = p.Presets.Presets
            // probPresets needs to be second!
            if doPresetArraysMatch(solvePresets, probPresets) == true {
                return false
            }
		}
	}

	return true
}
