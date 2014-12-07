package main

import (
	"container/list"
)

type Deque struct {
	container *list.List
	capacity  int
}

func NewDeque() *Deque {
	return NewCappedDeque(-1)
}

func NewCappedDeque(capacity int) *Deque {
	return &Deque{
		container: list.New(),
		capacity:  capacity,
	}
}

func (d *Deque) Enqueue(item interface{}) bool {
	if d.capacity < 0 || d.container.Len() < d.capacity {
		d.container.PushFront(item)
		return true
	}
	return false
}

func (d *Deque) Peek() interface{} {
	item := d.container.Front()
	if item != nil {
		return item.Value
	}
	return nil
}

func (d *Deque) Size() int {
	return d.container.Len()
}

func (d *Deque) Empty() bool {
	return d.container.Len() == 0
}

func (d *Deque) Dequeue() {
	item := d.container.Front()
	if item != nil {
		d.container.Remove(item)
	}
}
