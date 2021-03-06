package main

import (
	"fmt"
	"io/ioutil"
	"os"
)

func runConverter() {
	if levelFile == "" {
		fmt.Printf("Not levels file specified\n")
		return
	}
	if outputPath == "" {
		fmt.Printf("Not ouptut file specified\n")
		return
	}
	if title == "" {
		fmt.Printf("Level group title not specified\n")
		return
	}

	lFile, err := os.Open(levelFile)
	if err != nil {
		fmt.Printf("Error opening %s: %s\n", lFile.Name(), err)
		return
	}
	b, err := ioutil.ReadAll(lFile)
	if err != nil {
		fmt.Printf("Error reading %s: %s\n", lFile.Name(), err)
		return
	}
	lFile.Close()

	oFile, err := os.OpenFile(outputPath, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		fmt.Printf("Error opening output: %s\n", outputPath)
		return
	}

	// output
	_, err = oFile.WriteString("$.definitions.levels[$.definitions.levelCount++] = {\n")
	if err != nil {
		fmt.Printf("Error writing definition start output file: %s\n, err")
		return
	}
	_, err = oFile.WriteString(fmt.Sprintf("title: \"%s\",\n", title))
	if err != nil {
		fmt.Printf("Error writing title start to output file: %s\n, err")
		return
	}
	_, err = oFile.WriteString("levels: ")
	if err != nil {
		fmt.Printf("Error writing levels start to output file: %s\n, err")
		return
	}
	_, err = oFile.Write(b)
	if err != nil {
		fmt.Printf("Error writing json to output file: %s\n, err")
		return
	}
	_, err = oFile.WriteString("}")
	if err != nil {
		fmt.Printf("Error writing close to output file: %s\n, err")
		return
	}

}
