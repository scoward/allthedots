package main

import (
	"testing"
)

func TestIntArrayContains(t *testing.T) {
	a := []int{1, 2, 3}

	if isNodeInArray(1, a) == false {
		t.Errorf("Array should contain 1\n")
	}

	if isNodeInArray(4, a) == true {
		t.Errorf("Array should not contain 4\n")
	}
}

func TestDoPresetArraysMatch(t *testing.T) {
	a := []*Preset{&Preset{Directed: true, Path: []int{1, 2, 3}}}
	b := []*Preset{&Preset{Directed: true, Path: []int{1, 2, 3}}}

	if doPresetArraysMatch(a, b) == false {
		t.Errorf("Simple preset arrays should match\n")
	}

	a = []*Preset{&Preset{Directed: true, Path: []int{2, 1, 3}}}
	b = []*Preset{&Preset{Directed: true, Path: []int{1, 2, 3}}}

	if doPresetArraysMatch(a, b) == false {
		t.Errorf("Simple preset arrays should match\n")
	}

	a = []*Preset{&Preset{Directed: true, Path: []int{4, 1, 3}}}
	b = []*Preset{&Preset{Directed: true, Path: []int{1, 2, 3}}}

	if doPresetArraysMatch(a, b) == true {
		t.Errorf("Simple preset arrays should not match\n")
	}

	a = []*Preset{&Preset{Directed: true, Path: []int{4, 1, 3}}, &Preset{Directed: false, Path: []int{2, 1}}}
	b = []*Preset{&Preset{Directed: true, Path: []int{1, 2, 3}}, &Preset{Directed: false, Path: []int{1, 2}}}

	if doPresetArraysMatch(a, b) == true {
		t.Errorf("Simple preset arrays should not match\n")
	}

	a = []*Preset{&Preset{Directed: true, Path: []int{2, 1, 3}}, &Preset{Directed: false, Path: []int{2, 1}}}
	b = []*Preset{&Preset{Directed: true, Path: []int{1, 2, 3}}, &Preset{Directed: false, Path: []int{1, 2}}}

	if doPresetArraysMatch(a, b) == false {
		t.Errorf("Simple preset arrays should match\n")
	}
}

func TestSimplePresetMatch(t *testing.T) {
	a := &Preset{Directed: true, Path: []int{1, 2, 3}}
	b := &Preset{Directed: true, Path: []int{1, 2, 3}}

	if a.Equals(b) != true {
		t.Errorf("Presets do not equal:\n%+v\n%+v\n", a, b)
	}
}
