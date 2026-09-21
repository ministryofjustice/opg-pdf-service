package htmlprep

import (
	"strings"
	"testing"
)

func TestStripAnchorTags(t *testing.T) {
	in := `<a href="https://example.com">link</a><a>bare</a>`
	out, err := StripAnchorTags(in)
	if err != nil {
		t.Fatal(err)
	}
	if strings.Contains(out, "href") {
		t.Errorf("expected href removed, got %q", out)
	}
	if !strings.Contains(out, "link") || !strings.Contains(out, "bare") {
		t.Errorf("expected anchor text preserved, got %q", out)
	}
}
