package main

import ()

type Preset struct {
	Directed bool  `json:"forced"`
	Path     []int `json:"array"`
}

type PresetGroup struct {
	Presets []*Preset `json:"presets"`
	Max     int       `json:"-"`
	Num     int       `json:"-"`
	Set     []int     `json:"-"`
}

func NewPresetGroup(numNodes, maxPresets int) *PresetGroup {
	return &PresetGroup{Presets: make([]*Preset, maxPresets), Max: maxPresets, Num: 0, Set: make([]int, numNodes)}
}

// Make sure no node of the passed in preset is already in the presetgroup
// No check is done here
func (p *PresetGroup) addPreset(preset *Preset) {
	p.Num++
	p.Presets[p.Num-1] = preset
	for i := 0; i < len(preset.Path); i++ {
		// Store which preset array the node is in
		p.Set[preset.Path[i]] = p.Num
	}
}

func (p *PresetGroup) removeLastPreset() {
	if p.Num > 0 {
		p.Num--
		lastPresetPath := p.Presets[p.Num].Path
		for i := 0; i < len(lastPresetPath); i++ {
			p.Set[lastPresetPath[i]] = 0
		}
	}
}

func doPresetArraysMatch(a []*Preset, b []*Preset) bool {
	var aPreset *Preset
	var bPreset *Preset
	var num int = len(a)
	matchFound := true
	matchPossible := true

	for i := 0; i < num && matchPossible == true; i++ {
		aPreset = a[i]
		matchFound = false
		for j := 0; j < num && matchFound == false; j++ {
			bPreset = b[j]
			if aPreset.Equals(bPreset) {
				matchFound = true
			}
		}
		if matchFound != true {
			matchPossible = false
		}
	}

	return matchPossible
}

func isNodeInArray(node int, array []int) bool {
	for _, val := range array {
		if val == node {
			return true
		}
	}

	return false
}

func (a *Preset) Equals(b *Preset) bool {
	if a.Directed != b.Directed {
		return false
	}
	if len(a.Path) != len(b.Path) {
		return false
	}

	for i := 0; i < len(a.Path); i++ {
		if isNodeInArray(a.Path[i], b.Path) == false {
			return false
		}
	}

	return true
}
