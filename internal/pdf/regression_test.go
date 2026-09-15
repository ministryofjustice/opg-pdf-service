package pdf

import (
	"bytes"
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"testing"

	"github.com/ministryofjustice/opg-pdf-service/internal/config"
)

func TestBaselineFixturesRender(t *testing.T) {
	chrome := findChrome()
	if chrome == "" {
		t.Skip("no Chromium binary found; set PDF_CHROME_PATH to run render tests")
	}
	if os.Getenv("PDF_CHROME_PATH") == "" {
		t.Setenv("PDF_CHROME_PATH", chrome)
	}

	files, err := filepath.Glob(filepath.Join("..", "..", "src", "baseline", "*.html"))
	if err != nil {
		t.Fatal(err)
	}
	if len(files) == 0 {
		t.Fatal("no baseline fixtures found")
	}

	browser := NewBrowser()
	defer browser.Close()

	opts := config.Options{PrintBackground: true, EmulateMediaType: "print"}

	for _, file := range files {
		file := file
		t.Run(filepath.Base(file), func(t *testing.T) {
			html, err := os.ReadFile(file)
			if err != nil {
				t.Fatal(err)
			}

			out, err := Generate(context.Background(), browser, string(html), opts)
			if err != nil {
				t.Fatalf("render failed: %v", err)
			}
			if !bytes.HasPrefix(out, []byte("%PDF")) {
				t.Fatalf("output is not a PDF (missing %%PDF header)")
			}
			if len(out) < 1000 {
				t.Fatalf("PDF suspiciously small: %d bytes", len(out))
			}
		})
	}
}

func findChrome() string {
	if p := os.Getenv("PDF_CHROME_PATH"); p != "" {
		if _, err := os.Stat(p); err == nil {
			return p
		}
	}
	for _, name := range []string{
		"headless-shell", "google-chrome", "google-chrome-stable",
		"chromium", "chromium-browser", "chrome",
	} {
		if p, err := exec.LookPath(name); err == nil {
			return p
		}
	}
	macChrome := "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
	if _, err := os.Stat(macChrome); err == nil {
		return macChrome
	}
	return ""
}
