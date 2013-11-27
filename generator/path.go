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

func (s *Path) Push(n int) {
	if s.count >= len(s.nodes) {
		nodes := make([]int, len(s.nodes)*2)
		copy(nodes, s.nodes)
		s.nodes = nodes
	}
	s.nodes[s.count] = n
	s.set[n] = 1
	s.count++
	s.last++
}

func (s *Path) Contains(idx int) bool {
	return s.set[idx] == 1
}

func (s *Path) Count() int {
	return s.count
}

func (s *Path) Peek() int {
	return s.nodes[s.last]
}

// Looks into the stack s.count - 1 - num
// will return -1 if OOB
func (s *Path) Past(num int) int {
	idx := s.last - num
	if idx > -1 {
		return s.nodes[idx]
	}
	return -1
}

func (s *Path) Bottom() int {
	return s.nodes[0]
}

func (s *Path) Pop() int {
	if s.count == 0 {
		return 0
	}
	node := s.nodes[s.last]
	s.last--
	s.count--
	s.set[node] = 0
	return node
}

func (s *Path) GetArray() []int {
	return s.nodes[:s.count]
}
