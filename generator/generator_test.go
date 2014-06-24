package main

import (
	"testing"
)

func TestPresetGen(t *testing.T) {
	array := make([]int, 1)
	array[0] = 3
	canMove := genCanMove(4, 4, array)
	if canMove == true {
		t.Errorf("Should not be able to move\n")
	}

	array[0] = 4
	canMove = genCanMove(3, 4, array)
	if canMove == true {
		t.Errorf("Should not be able to move\n")
	}
}
