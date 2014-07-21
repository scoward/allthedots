package main

import (
    "time"
    "strconv"
)

func stringifyTime(t time.Time) string {
	y, m, d := t.Date()
	year := strconv.Itoa(y)
	month := ""
	if m < 10 {
		month = "0" + strconv.Itoa(int(m))
	} else {
		month = strconv.Itoa(int(m))
	}
	day := ""
	if d < 10 {
		day = "0" + strconv.Itoa(d)
	} else {
		day = strconv.Itoa(d)
	}
	h := t.Hour()
	hour := ""
	if h < 10 {
		hour = "0" + strconv.Itoa(h)
	} else {
		hour = strconv.Itoa(h)
	}
	min := t.Minute()
	minutes := ""
	if min < 10 {
		minutes = "0" + strconv.Itoa(min)
	} else {
		minutes = strconv.Itoa(min)
	}
	sec := t.Second()
	seconds := ""
	if sec < 10 {
		seconds = "0" + strconv.Itoa(sec)
	} else {
		seconds = strconv.Itoa(sec)
	}

	return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds
}
