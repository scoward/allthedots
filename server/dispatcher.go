package main

import (
	"fmt"
)

var WorkerQueue chan chan *WorkRequest

func RunQueue(in <-chan *WorkRequest, out chan<- *WorkRequest) {
	queue := NewDeque()
	defer func() {
		for !queue.Empty() {
			out <- queue.Peek().(*WorkRequest)
			queue.Dequeue()
		}
		close(out)
	}()

	for {
		if queue.Empty() {
			v, ok := <-in
			if !ok {
				return
			}
			queue.Enqueue(v)
		}

		select {
		case out <- queue.Peek().(*WorkRequest):
			queue.Dequeue()
		case v, ok := <-in:
			if !ok {
				return
			}
			queue.Enqueue(v)
		}
	}
}

func StartDispatcher(nworkers int) {
	WorkerQueue = make(chan chan *WorkRequest, nworkers)

	for i := 0; i < nworkers; i++ {
		worker := NewWorker(i+1, WorkerQueue)
		worker.Start()
	}
    fmt.Printf("Done starting workers\n");

	go RunQueue(MessageQueue, WorkQueue)

	go func() {
		for {
			select {
			case work := <-WorkQueue:
				fmt.Printf("Received work request\n")
				go func() {
					worker := <-WorkerQueue

					fmt.Printf("Dispatching work request\n")
					worker <- work
				}()
			}
		}
	}()
}
