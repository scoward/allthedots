package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"math/rand"
	"os"
	"strconv"
	"strings"
	"time"

	//	"os"
	//	"runtime/pprof"
)

var rows, cols, numProblems, start, count int
var seed int64
var solvesFile, refFile, countFile string
var outputPath, levelFile, title string
var help bool

func init() {
	// For generator
	flag.IntVar(&rows, "r", 6, "Rows")
	flag.IntVar(&cols, "c", 6, "Cols")
	flag.IntVar(&numProblems, "n", 5, "Number of levels to generate")
	flag.StringVar(&solvesFile, "s", "", "Solves file")
	flag.StringVar(&refFile, "ref", "", "Reference file")
	flag.StringVar(&countFile, "count", "", "Path to count file")
	flag.Int64Var(&seed, "seed", time.Now().Unix(), "Seed to use for RNG")
	// For converting and output
	flag.StringVar(&levelFile, "l", "", "Level file from generator")
	flag.StringVar(&outputPath, "o", "", "Output file")
	flag.StringVar(&title, "t", "", "Level group title")
	// Help
	flag.BoolVar(&help, "h", false, "Whether to show usage")
	flag.Parse()
}

func getCount() error {
	b, err := ioutil.ReadFile(countFile)
	if err != nil {
		return err
	}
	pCount, err := strconv.ParseInt(strings.Trim(string(b), "\n"), 10, 64)
	if err != nil {
		return err
	}
	count = int(pCount)
	return nil
}

func writeCount() {
	out := strconv.Itoa(count)
	file, err := os.OpenFile(countFile, os.O_WRONLY, 0666)
	if err != nil {
		fmt.Printf("Error opening count file, something very bad has happened!!!\n")
		fmt.Printf("I really hope you backed up previous levels\n")
		return
	}
	_, err = file.Write([]byte(out))
	if err != nil {
		fmt.Printf("Error writing out count, something very bad has happened!!!\n")
		fmt.Printf("I really hope you backed up previous levels\n")
		return
	}
	file.Close()
}

func runGenerator() {
	if solvesFile == "" {
		fmt.Printf("Output file needs to be specified\n")
		return
	}

	if countFile == "" {
		count = 0
	} else {
		err := getCount()
		if err != nil {
			fmt.Printf("Error getting count from file: %s\n", err)
			return
		}
	}

	fmt.Printf("Starting with count: %d\n", count)

	fmt.Printf("Random seed: %+v\n", seed)
	r := rand.New(rand.NewSource(seed))
	solvability := LoadSolvability(rows, cols)

	var refSolves []*Solve
	var solves []*Solve

	file, err := os.OpenFile(solvesFile, os.O_RDWR|os.O_CREATE, 0666)
	if err != nil {
		fmt.Printf("Error opening file\n")
		solves = make([]*Solve, 0)
	} else {
		solves = ParseSolvesFile(file)
	}

	if refFile != "" {
		refF, err := os.OpenFile(refFile, os.O_RDONLY, 0666)
		if err != nil {
			fmt.Printf("Error opening ref file")
			refSolves = make([]*Solve, 0)
			refF.Close()
		} else {
			refSolves = ParseSolvesFile(refF)
		}
	}

	numSolves := 0
	skips := 0
	solvabilitySkips := 0
	nonUniques := 0
	unique := true
	for numSolves < numProblems {
		start, end := generateStartEnd(rows*cols, r)
		prob := NewProblem(rows, cols, start, end, r)
		if solvability.IsSolvable(start, end) == false {
			solvabilitySkips++
			continue
		}
		errNum := prob.Generate()
		if errNum != 0 {
			// do nothing atm
			if errNum != 1 {
				skips++
				//fmt.Printf("Skipping problem: %d\n", errNum)
			} else {
				solvability.AddUnsolvable(start, end)
			}
		} else {
			unique = prob.isSolveUnique(solves)
			if unique && len(refSolves) > 0 {
				unique = prob.isSolveUnique(refSolves)
			}
			if unique {
				/*fmt.Printf("Successful generation!\n")
				fmt.Printf("# s: %d, e: %d\n", prob.Start, prob.End)
				fmt.Printf("Presets: %+v\n", *prob.Presets)
				for i := 0; i < prob.Presets.Num; i++ {
					fmt.Printf("Preset: %+v\n", prob.Presets.Presets[i])
				}*/
				fmt.Printf("Successful generation! %d\n", numSolves+1)
				fmt.Printf("Problem: %+v\n", prob)

				// add to solves, increase num solves
				numSolves++
				count++
				s := CreateSolve(count, prob)
				solves = append(solves, s)
			} else {
				nonUniques++
				fmt.Printf("Non unique solution\n")
			}
		}
	}

	solvability.Save()

	out, err := json.MarshalIndent(solves, "", "\t")
	if err != nil {
		fmt.Printf("Error marshalling data\n")
	} else {
		file.Seek(0, 0)
		buf := bytes.NewBuffer(out)
		_, err = buf.WriteTo(file)
		file.Write([]byte{'\n'})
		if err != nil {
			fmt.Printf("Error writing to file\n")
		} else {
			if countFile != "" {
				writeCount()
			}

			fmt.Printf("\nFinished creating %d new problems for a total of %d problems in file %s\n",
				numSolves, len(solves), file.Name())
			fmt.Printf("Non unique finds: %d\n", nonUniques)
			fmt.Printf("General Skips: %d\n", skips)
			fmt.Printf("Unsolvable Skips: %d\n", solvabilitySkips)
		}
	}
}

func main() {
	/*f, _ := os.Create("gen.cpuprofile")
	pprof.StartCPUProfile(f)
	defer pprof.StopCPUProfile()*/

	if help {
		fmt.Printf("\nLevel generator and converter for All the Dots\n\n")
		fmt.Printf("To run the generator:\n")
		fmt.Printf("\t-r     Number of rows \t\t\t(6)\n")
		fmt.Printf("\t-c     Number of columns \t\t(6)\n")
		fmt.Printf("\t-n     Number of levels to generate \t(5)\n")
		fmt.Printf("\t-s     Solve output file\n")
		fmt.Printf("\t-ref   Reference file, a list of previously solved problems for row/col\n")
		fmt.Printf("\t-count Path to count file\n")
		fmt.Printf("\t-seed  Seed to use for rng\n")

		fmt.Printf("\nTo run the converter:\n")
		fmt.Printf("\t-l Generated level file\n")
		fmt.Printf("\t-o Output file\n")
		fmt.Printf("\t-t Level group title\n")

		fmt.Printf("\nThe converter and generator run exclusively,\nsetting -o will attempt to run the converter.\n\n")
	} else if outputPath == "" {
		runGenerator()
	} else {
		runConverter()
	}
}
