package config

import (
	"net/http"
	"testing"
)

func TestMargin(t *testing.T) {
	cases := map[string]int{
		"300":  300,
		"":     0,
		"abc":  0,
		"10px": 10,
		"-5":   -5,
	}
	for in, want := range cases {
		if got := Margin(in); got != want {
			t.Errorf("Margin(%q) = %d, want %d", in, got, want)
		}
	}
}

func TestEmulateMediaType(t *testing.T) {
	if got := EmulateMediaType("screen"); got != "screen" {
		t.Errorf("got %q, want screen", got)
	}
	if got := EmulateMediaType(""); got != "print" {
		t.Errorf("got %q, want print", got)
	}
}

func TestTitleDefaults(t *testing.T) {
	if got := Title(""); got != defaultTitle {
		t.Errorf("got %q, want default", got)
	}
	if got := Title("custom"); got != "custom" {
		t.Errorf("got %q, want custom", got)
	}
}

func TestFromHeaders(t *testing.T) {
	h := http.Header{}
	h.Set("strip-anchor-tags", "true")
	h.Set("print-background", "true")
	h.Set("margin-top", "25")
	h.Set("emulate-media-type", "screen")

	opts := FromHeaders(h)
	if !opts.StripTags || !opts.PrintBackground {
		t.Error("expected boolean flags true")
	}
	if opts.MarginTop != 25 {
		t.Errorf("MarginTop = %d, want 25", opts.MarginTop)
	}
	if opts.EmulateMediaType != "screen" {
		t.Errorf("EmulateMediaType = %q, want screen", opts.EmulateMediaType)
	}
	if opts.EmbedRemoteImages {
		t.Error("expected EmbedRemoteImages false when header absent")
	}
}
