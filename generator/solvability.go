package main

import (
	"fmt"
	"os"
    "encoding/json"
    "bytes"
    "io/ioutil"
)

type known struct {
	Start int `json:"start"`
	End   int `json:"end"`
}

type Solvability struct {
	solvable [][]int
	knowns   []*known
	path     string
}

func LoadSolvability(rows, cols int) *Solvability {
	num := rows * cols
	solvable := make([][]int, num)
	for i := 0; i < num; i++ {
		solvable[i] = make([]int, num)
	}
	s := &Solvability{solvable: solvable}
	s.path = fmt.Sprintf("data/solv%dx%d.txt", rows, cols)

	if _, err := os.Stat(s.path); err != nil {
		s.knowns = make([]*known, 0, 10)
	} else {
        file, _ := os.OpenFile(s.path, os.O_RDONLY, 0666)
        b, err := ioutil.ReadAll(file)
        if err != nil {
            fmt.Printf("Error reading %s: %s\n", file.Name(), err)
            s.knowns = make([]*known, 0, 10)
        } else {
            file.Close()
            err = json.Unmarshal(b, &s.knowns)
            if err != nil {
                fmt.Printf("Error unmarshalling data from file: %s\n", err)
                s.knowns = make([]*known, 0, 10)
            } else {
                for _, known := range s.knowns {
                    s.solvable[known.Start][known.End] = 1
                }
            }
        }
    }

	return s
}

func (s *Solvability) AddUnsolvable(start, end int) {
	s.solvable[start][end] = 1
	s.knowns = append(s.knowns, &known{start, end})
}

func (s *Solvability) IsSolvable(start, end int) bool {
	return s.solvable[start][end] != 1
}

func (s *Solvability) Save() {
    fmt.Printf("\nSaving solvability data\n")
    file, _ := os.OpenFile(s.path, os.O_WRONLY|os.O_CREATE, 0666)
	out, err := json.MarshalIndent(s.knowns, "", "\t")
    if err != nil {
        fmt.Printf("Error marshalling solvability data\n")
    } else {
        buf := bytes.NewBuffer(out)
        _, err = buf.WriteTo(file)
        file.Write([]byte{'\n'})
        file.Close()
    }
}
