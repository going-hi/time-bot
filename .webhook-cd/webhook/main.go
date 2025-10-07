package main

import (
	"fmt"
	"net/http"
	"os"
	"os/exec"
)

func main() {
	fmt.Println("WEBHOOK FOR CD")
	http.HandleFunc("/", handleWebhook)
	http.ListenAndServe(":8080", nil)
}



func handleWebhook(w http.ResponseWriter, req *http.Request) {
	token := req.Header.Get("Authorization")

	if token == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	envToken := os.Getenv("TOKEN")

	if token != envToken {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	runCmd()
	w.WriteHeader(http.StatusOK)
}

func runCmd() {
	cmd := exec.Command("make", "update")

	_, err := cmd.Output()
	if err != nil {
		fmt.Println("Error:", err.Error())
		return
	}
}