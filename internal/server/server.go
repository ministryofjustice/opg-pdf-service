package server

import (
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/ministryofjustice/opg-pdf-service/internal/config"
	"github.com/ministryofjustice/opg-pdf-service/internal/pdf"
)

const maxBodyBytes = 2000 * 1024

func New(browser *pdf.Browser) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /generate-pdf", generateHandler(browser))
	mux.HandleFunc("GET /health-check", healthHandler)
	return mux
}

func generateHandler(browser *pdf.Browser) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := io.ReadAll(http.MaxBytesReader(w, r.Body, maxBodyBytes))
		if err != nil {
			http.Error(w, "request body too large or unreadable", http.StatusBadRequest)
			return
		}

		opts := config.FromHeaders(r.Header)

		result, err := pdf.Generate(r.Context(), browser, string(body), opts)
		if err != nil {
			log.Printf("generate-pdf failed: %v", err)
			w.Header().Set("X-Error-Code", "There is a problem with the service.")
			http.Error(w, "", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/pdf")
		w.Header().Set("Content-Disposition", "attachment; filename=download.pdf")
		w.Header().Set("Content-Length", fmt.Sprintf("%d", len(result)))
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write(result)
	}
}

func healthHandler(w http.ResponseWriter, _ *http.Request) {
	_, _ = io.WriteString(w, "OK")
}
