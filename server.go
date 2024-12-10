package main

import (
	"log"
	"net/http"
)

func main() {
	fs := http.FileServer(http.Dir("./src"))
	http.Handle("/", fs)
	http.HandleFunc("/get/questions", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./src/data.json")
	})

	log.Print("Listening on :3000...")
	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		log.Fatal(err)
	}
}
