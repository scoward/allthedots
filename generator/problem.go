package main

import (
	"errors"
)

var MAX_PRESETS_IN_LEVEL int = 5

type Preset struct {
	directed bool
	path     []int
}

type Problem struct {
	Graph   *GridGraph
	Start   int
	End     int
	Presets []*Preset
}

func NewProblem(row, cols, start, end int) *Problem {
	graph := NewGridGraph(rows, cols)
	presets := make([]*Preset, MAX_PRESETS_IN_LEVEL)
	return &Problem{Graph: graph, Start: start, End: end, Presets: presets}
}

// Returns error num + regular error
// Error numbers are as follows:
// 1 too many presets
func (p *Problem) addDirectedPath(array []int) (int, error) {
	if len(p.Presets) == MAX_PRESETS_IN_LEVEL {
		return 1, errors.New("Too many presets in level")
	}

	// TODO check the preset against others in class
	// TODO check the preset against similar levels

	p.Presets = append(p.Presets, &Preset{directed: true, path: array})
	return 0, nil
}

func (p *Problem) addUndirectedPath(array []int) (int, error) {
	return 0, nil
}
