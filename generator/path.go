package main

func NewPath(capacity int) *Path {
	s := &Path{nodes: make([]int, capacity), set: make([]int, capacity), count: 0, last: -1}
	return s
}

type Path struct {
	nodes []int
	set   []int
	count int
	last  int
}

func (p *Path) Push(n int) {
	if p.count >= len(p.nodes) {
		nodes := make([]int, len(p.nodes)*2)
		copy(nodes, p.nodes)
		p.nodes = nodes
	}
	p.nodes[p.count] = n
	p.set[n] = 1
	p.count++
	p.last++
}

func (p *Path) Contains(idx int) bool {
	return p.set[idx] == 1
}

func (p *Path) Count() int {
	return p.count
}

func (p *Path) Peek() int {
	return p.nodes[p.last]
}

// Looks into the stack p.count - 1 - num
// will return -1 if OOB
func (p *Path) Past(num int) int {
	idx := p.last - num
	if idx > -1 {
		return p.nodes[idx]
	}
	return -1
}

func (p *Path) Bottom() int {
	return p.nodes[0]
}

func (p *Path) Pop() int {
	if p.count == 0 {
		return 0
	}
	node := p.nodes[p.last]
	p.last--
	p.count--
	p.set[node] = 0
	return node
}

func (p *Path) GetArray() []int {
	return p.nodes[:p.count]
}

func (p *Path) Copy() *Path {
	newPath := NewPath(p.count)
	for i := 0; i < p.count; i++ {
		newPath.Push(p.nodes[i])
	}

	return newPath
}
