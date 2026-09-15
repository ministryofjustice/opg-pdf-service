package htmlprep

import (
	"context"
	"encoding/base64"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

func EmbedRemoteImages(ctx context.Context, html string) (string, error) {
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
	if err != nil {
		return "", err
	}

	doc.Find("img").Each(func(_ int, s *goquery.Selection) {
		if s.Closest("template").Length() > 0 {
			return
		}
		src, ok := s.Attr("src")
		if !ok || strings.HasPrefix(src, "data:") {
			return
		}

		s.SetAttr("src", "")
		dataURI, err := fetchAsDataURI(ctx, src)
		if err != nil {
			log.Printf("embedRemoteImages: %v", err)
			return
		}
		s.SetAttr("src", dataURI)
	})

	return doc.Html()
}

func fetchAsDataURI(ctx context.Context, url string) (string, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return "", err
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("fetching image %s: status %d", url, resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	contentType := resp.Header.Get("Content-Type")
	if contentType == "" {
		contentType = http.DetectContentType(body)
	}

	return "data:" + contentType + ";base64," + base64.StdEncoding.EncodeToString(body), nil
}
