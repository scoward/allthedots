package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

type Solve struct {
	Start     int       `json:"start"`
	End       int       `json:"end"`
	Rows      int       `json:"rows"`
	Cols      int       `json:"cols"`
	Id        int       `json:"id"`
	Solves    int       `json:"solves"`
	MaxSolves int       `json:"maxSolves"`
	Presets   []*Preset `json:"presets"`
}

func CreateSolve(id int, p *Problem) *Solve {
	s := Solve{Start: p.Start, End: p.End, Rows: p.Graph.Rows, Cols: p.Graph.Cols, Id: id,
		Solves: p.Solves, MaxSolves: p.MaxSolves}

	s.Presets = make([]*Preset, p.Presets.Num)
	for i := 0; i < p.Presets.Num; i++ {
		s.Presets[i] = p.Presets.Presets[i]
	}

	return &s
}

func ParseSolvesFile(file *os.File) []*Solve {
	var solves []*Solve

	b, err := ioutil.ReadAll(file)
	if err != nil {
		fmt.Printf("Error reading %s: %s\n", file.Name(), err)
		solves = make([]*Solve, 0)
	} else {
		err = json.Unmarshal(b, &solves)
		if err != nil {
			fmt.Printf("Error unmarshalling data from file: %s\n", err)
			solves = make([]*Solve, 0)
		}
	}

	return solves
}
