package main

func NewStack(capacity int) *Stack {
    s := &Stack{nodes: make([]int, capacity), set: make([]int, capacity)}
    return s
}

type Stack struct {
	nodes []int
    set []int
	count int
}

func (s *Stack) Push(n int) {
	if s.count >= len(s.nodes) {
		nodes := make([]int, len(s.nodes)*2)
		copy(nodes, s.nodes)
		s.nodes = nodes
	}
	s.nodes[s.count] = n
    s.set[n] = 1
	s.count++
}

func (s *Stack) Contains(idx int) bool {
	return s.set[idx] == 1
}

func (s *Stack) Count() int {
    return s.count
}

func (s *Stack) Peek() int {
    return s.nodes[s.count - 1]
}

func (s *Stack) Bottom() int {
    return s.nodes[0]
}

func (s *Stack) Pop() int {
	if s.count == 0 {
		return 0
	}
	node := s.nodes[s.count-1]
	s.count--
    s.set[node] = 0
	return node
}

func (s *Stack) GetArray() []int {
    return s.nodes[:s.count]
}
