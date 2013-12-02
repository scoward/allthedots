package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"math/rand"
	"os"
    "bytes"
    "time"

	//	"os"
	//	"runtime/pprof"
)

var rows, cols, numProblems int
var solvesFile string

func init() {
	flag.IntVar(&rows, "r", 6, "rows")
	flag.IntVar(&cols, "c", 6, "cols")
	flag.IntVar(&numProblems, "n", 5, "numProblems")
	flag.StringVar(&solvesFile, "s", fmt.Sprintf("levels/%dx%dsolves.txt", rows, cols), "solvesFile")
	flag.Parse()
}

func main() {
	/*f, _ := os.Create("gen.cpuprofile")
	pprof.StartCPUProfile(f)
	defer pprof.StopCPUProfile()*/

	r := rand.New(rand.NewSource(time.Now().Unix()))

	file, err := os.OpenFile(solvesFile, os.O_RDWR|os.O_CREATE, 0666)
	if err != nil {

	}
	solves := ParseSolvesFile(file)
	solveNum := len(solves)

	numSolves := 0
    skips := 0
    nonUniques := 0
	unique := true
	for numSolves < numProblems {
		start, end := generateStartEnd(rows*cols, r)
		prob := NewProblem(rows, cols, start, end, r)
		errNum := prob.Solve()
		if errNum != 0 {
			// do nothing atm
			if errNum != 1 {
                skips++
				//fmt.Printf("Skipping problem: %d\n", errNum)
			}
		} else {
			unique = prob.isSolveUnique(solves)
			if unique {
				/*fmt.Printf("Successful generation!\n")
				fmt.Printf("# s: %d, e: %d\n", prob.Start, prob.End)
				fmt.Printf("Presets: %+v\n", *prob.Presets)
				for i := 0; i < prob.Presets.Num; i++ {
					fmt.Printf("Preset: %+v\n", prob.Presets.Presets[i])
				}*/
				fmt.Printf("Successful generation!\n")

				// add to solves, increase num solves
				numSolves++
				solveNum++
				s := CreateSolve(solveNum, prob)
				solves = append(solves, s)
			} else {
                nonUniques++
				fmt.Printf("Non unique solution\n")
			}
		}
	}

    out, err := json.MarshalIndent(solves, "", "\t")
    if err != nil {
        fmt.Printf("Error marshalling data\n")
    } else {
        file.Seek(0, 0)
        buf := bytes.NewBuffer(out)
        _, err = buf.WriteTo(file)
        if err != nil {
            fmt.Printf("Error writing to file\n")
        } else {
            fmt.Printf("\nFinished creating %d new problems for a total of %d problems in file %s\n", numSolves, solveNum, file.Name())
            fmt.Printf("Non unique finds: %d\n", nonUniques)
            fmt.Printf("Skips: %d\n", skips)
        }
    }
}
