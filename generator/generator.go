package main

import (
	"math/rand"
    "errors"
)

// Start and stop generator using the random number generator
func generateStartEnd(num int, r *rand.Rand) (int, int) {
	start := r.Intn(num)
	endFound := false
	var endNum int

	for endFound == false {
		endNum = r.Intn(num)
		if endNum != start {
			endFound = true
		}
	}

	return start, endNum
}

// true means directed
// false means undirected
func generatePresetPathType(r *rand.Rand) bool {
    // 50% change to be directed
    return r.Intn(100) < 50
}

func generateNumPresets(row, cols int, r *rand.Rand) int {
    // TODO make this generate off r and differ by row/cols
    return 2
}

func generatePresetLength(rows, cols int, r *rand.Rand) int {
	// TODO: Make it specific on row/col setup (bigger grids
	// get longer presets)
	n := r.Intn(100)

	if n < 45 {
		// 45% chance for 2
		return 2
	} else if n <= 85 {
		// 45% chance for 3
		return 3
	} else if n > 90 {
		// 10% chance for 4
		return 4
	}

	return 2
}

// Generates preset with some input from the preset group
// ATM input from pg:
// - Makes sure idx isn't in a preset
//
// Will return an error if too many attempts are mode to create the preset, basically
// just try again
func generatePreset(p *PresetGroup, rows, cols int, r *rand.Rand) ([]int, error) {
	num := rows * cols

	length := generatePresetLength(rows, cols, r)
	array := make([]int, length)

	var n int
	var canMove bool = false
    var attempts int
    var maxAttempts = num * 2
	i := 0
	for i < length {
        // if we've attempted to find a valid move for num * 2 then end
        // generation attempt and return error
        if attempts == maxAttempts {
            break
        }
        attempts++
		n = r.Intn(num)
		// make sure generated n is not already taken by a different path
		if p.Set[n] != 0 {
			continue
		}

		canMove = true
		if i != 0 {
			// make sure we can move to new n
			// first, make sure it's not already on path
			for j := 0; j < i && canMove == true; j++ {
				if array[j] == n {
					continue
				}
			}

			// second, make sure it's a valid move
			// moving left, make sure we're not left edge
			// moving right, make sure we're not on right edge
			// up/down just need to see if the prev is below/above
            // n%cols == 0 means on left side
            // (n-cols)%cols == 0 means on right side
			if n+1 == array[i] && n%cols != 0 ||
				n-1 == array[i] && (n-cols)%cols != 0 ||
				n-cols == array[i] ||
				n+cols == array[i] {
				canMove = true
			}
			if canMove == false {
				continue
			}
		}

		array[i] = n
		i++
        attempts = 0
	}

    if attempts == maxAttempts {
        return array, errors.New("Error generating preset")
    }

	return array, nil
}
