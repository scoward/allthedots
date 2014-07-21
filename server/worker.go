package main

import (
	"fmt"
)

type Worker struct {
	Id          int
	Work        chan *WorkRequest
	WorkerQueue chan chan *WorkRequest
	QuitChan    chan bool
}

const (
    PlayerScoreEvent = iota
    UserReportEvent = iota
)

type WorkRequest struct {
	Type    int
	Object  interface{}
	Retries int
}

func NewWorker(id int, workerQueue chan chan *WorkRequest) *Worker {
	worker := Worker{
		Id:          id,
		Work:        make(chan *WorkRequest),
		WorkerQueue: workerQueue,
		QuitChan:    make(chan bool),
	}
	return &worker
}

func (w *Worker) Start() {
	go func() {
		for {
			w.WorkerQueue <- w.Work

			select {
			case work := <-w.Work:
				found := false
                var err error = nil
                var shouldIncrement bool
				if work.Type == UserReportEvent {
					found = true
					u := work.Object.(*UserReport)
					fmt.Printf("Worker%d: Received work request, %+v\n", w.Id, work.Object)
					err, shouldIncrement = handleUserReport(u)
				} else if work.Type == PlayerScoreEvent {
                    found = true
                    p := work.Object.(*PlayerScore)
					fmt.Printf("Worker%d: Received player score, %+v\n", w.Id, work.Object)
					err, shouldIncrement = handlePlayerScore(p)
                }
				if found {
                    if err != nil {
						fmt.Printf("%s (increment: %b)\n", err, shouldIncrement)
						if shouldIncrement {
							work.Retries++
						}
					}
                    if err != nil {
                        if work.Retries < 10 {
                            fmt.Printf("Requeueing work request due to error\n")
                            MessageQueue <- work
                        } else {
                            fmt.Printf("Dropping work %s from queue\n", work.Type)
                        }
                    }
				} else {
					fmt.Printf("Type not found: %s\n", work.Type)
				}
			case <-w.QuitChan:
				fmt.Printf("Worker%d stopping\n", w.Id)
				return
			}
		}
	}()
}

func (w *Worker) Stop() {
	go func() {
		w.QuitChan <- true
	}()
}