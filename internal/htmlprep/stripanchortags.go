package htmlprep

import (
	"strings"

	"github.com/PuerkitoBio/goquery"
)

func StripAnchorTags(html string) (string, error) {
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
	if err != nil {
		return "", err
	}
	doc.Find("a").Each(func(_ int, s *goquery.Selection) {
		s.RemoveAttr("href")
	})
	return doc.Html()
}
