package htmlprep

import (
	"context"
	"encoding/base64"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"golang.org/x/net/html"
	"golang.org/x/net/html/atom"
)

// I don't think this is actually used but converted it over from the original node bits (can possibly be removed)
func EmbedRemoteImages(ctx context.Context, input string) (string, error) {
	doc, err := html.Parse(strings.NewReader(input))
	if err != nil {
		return "", err
	}

	var walk func(n *html.Node, inTemplate bool)
	walk = func(n *html.Node, inTemplate bool) {
		if n.Type == html.ElementNode {
			if n.DataAtom == atom.Template {
				inTemplate = true
			} else if n.DataAtom == atom.Img && !inTemplate {
				embedImage(ctx, n)
			}
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			walk(c, inTemplate)
		}
	}
	walk(doc, false)

	var sb strings.Builder
	if err := html.Render(&sb, doc); err != nil {
		return "", err
	}
	return sb.String(), nil
}

func embedImage(ctx context.Context, n *html.Node) {
	for i := range n.Attr {
		if n.Attr[i].Key != "src" {
			continue
		}
		src := n.Attr[i].Val
		if src == "" || strings.HasPrefix(src, "data:") {
			return
		}

		n.Attr[i].Val = ""
		dataURI, err := fetchAsDataURI(ctx, src)
		if err != nil {
			log.Printf("embedRemoteImages: %v", err)
			return
		}
		n.Attr[i].Val = dataURI
		return
	}
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
	defer func() { _ = resp.Body.Close() }()

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
