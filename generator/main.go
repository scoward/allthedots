package main

import (
	"flag"
	"fmt"

	//	"os"
	//	"runtime/pprof"
)

var rows, cols, numProblems int
var solvesFile string

func init() {
	flag.IntVar(&rows, "r", 6, "rows")
	flag.IntVar(&cols, "c", 6, "cols")
	flag.IntVar(&numProblems, "n", 1000, "numProblems")
	flag.StringVar(&solvesFile, "s", fmt.Sprintf("%dx%dsolves.txt", rows, cols), "solvesFile")
	flag.Parse()
}

func main() {
	/*f, _ := os.Create("gen.cpuprofile")
	pprof.StartCPUProfile(f)
	defer pprof.StopCPUProfile()*/

	prob := NewProblem(6, 6, 0, 34)

	solves := getNumHamPaths(prob)

	fmt.Printf("# solves: %d\n", solves)
	//fmt.Printf("# skips: %d\n", prob.Skips)
}
