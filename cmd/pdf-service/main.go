package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ministryofjustice/opg-pdf-service/internal/pdf"
	"github.com/ministryofjustice/opg-pdf-service/internal/server"
)

func main() {
	port := getenv("PDF_SERVICE_PORT", "80")

	browser := pdf.NewBrowser()
	defer browser.Close()

	srv := &http.Server{
		Addr:              ":" + port,
		Handler:           server.New(browser),
		ReadHeaderTimeout: 10 * time.Second,
	}

	go func() {
		log.Printf("pdf-service listening on :%s", port)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("server error: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_ = srv.Shutdown(ctx)
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
