package config

import (
	"net/http"
	"strings"
)

type Options struct {
	StripTags         bool
	EmbedRemoteImages bool
	MarginTop         int
	MarginBottom      int
	MarginLeft        int
	MarginRight       int
	Title             string
	Subject           string
	PrintBackground   bool
	EmulateMediaType  string
}

const defaultTitle = "View LPA - View a lasting power of attorney"

func FromHeaders(h http.Header) Options {
	return Options{
		StripTags:         boolTrue(h.Get("strip-anchor-tags")),
		EmbedRemoteImages: boolTrue(h.Get("embed-remote-images")),
		MarginTop:         Margin(h.Get("margin-top")),
		MarginBottom:      Margin(h.Get("margin-bottom")),
		MarginLeft:        Margin(h.Get("margin-left")),
		MarginRight:       Margin(h.Get("margin-right")),
		Title:             Title(h.Get("title")),
		Subject:           h.Get("subject"),
		PrintBackground:   boolTrue(h.Get("print-background")),
		EmulateMediaType:  EmulateMediaType(h.Get("emulate-media-type")),
	}
}

func Margin(v string) int {
	v = strings.TrimSpace(v)
	i := 0
	if i < len(v) && (v[i] == '+' || v[i] == '-') {
		i++
	}
	start := i
	for i < len(v) && v[i] >= '0' && v[i] <= '9' {
		i++
	}
	if start == i {
		return 0
	}
	n := 0
	neg := strings.HasPrefix(v, "-")
	for _, c := range v[start:i] {
		n = n*10 + int(c-'0')
	}
	if neg {
		n = -n
	}
	return n
}

func Title(v string) string {
	if v == "" {
		return defaultTitle
	}
	return v
}

func EmulateMediaType(v string) string {
	if v == "" {
		return "print"
	}
	return v
}

func boolTrue(v string) bool {
	return v == "true"
}
