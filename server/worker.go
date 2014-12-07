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
	LevelCompleteEvent = iota
	UserReportEvent
	UpdateLevelStats
	UpdateUserTotals
)

type WorkRequest struct {
	Type    int
	Object  interface{}
	Retries int
}

func NewWorkRequest(t int, object interface{}) *WorkRequest {
	return &WorkRequest{Type: t, Object: object}
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
				var err error
				var shouldIncrement bool
				if work.Type == UserReportEvent {
					found = true
					u := work.Object.(*UserReport)
					fmt.Printf("Worker%d: Received work request, %+v\n", w.Id, work.Object)
					shouldIncrement, err = handleUserReport(u)
				} else if work.Type == LevelCompleteEvent {
					found = true
					l := work.Object.(*LevelComplete)
					fmt.Printf("Worker%d: Received player score, %+v\n", w.Id, work.Object)
					shouldIncrement, err = handleLevelComplete(l)
				} else if work.Type == UpdateLevelStats {
					found = true
					l := work.Object.(*LevelComplete)
					fmt.Printf("Worker%d: Received level stats event, %+v\n", w.Id, work.Object)
					shouldIncrement, err = levelCompleteUpdateStats(l)
				} else if work.Type == UpdateUserTotals {
					found = true
					l := work.Object.(*LevelComplete)
					fmt.Printf("Worker%d: Received update user totals event, %+v\n", w.Id, work.Object)
					shouldIncrement, err = levelCompleteUpdateUser(l)
				}
				if found {
					if err != nil {
						fmt.Printf("%s (increment: %t)\n", err, shouldIncrement)
						if shouldIncrement {
							work.Retries++
						}
					}
					if err != nil {
						if work.Retries < 10 {
							fmt.Printf("Requeueing work request due to error\n")
							MessageQueue <- work
						} else {
							fmt.Printf("Dropping work %d from queue\n", work.Type)
						}
					}
				} else {
					fmt.Printf("Type not found: %d\n", work.Type)
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
