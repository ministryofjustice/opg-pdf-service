package pdf

import (
	"context"
	"os"
	"time"

	"github.com/chromedp/cdproto/emulation"
	"github.com/chromedp/cdproto/page"
	"github.com/chromedp/chromedp"

	"github.com/ministryofjustice/opg-pdf-service/internal/config"
)

const (
	pxPerInch      = 96.0
	a4WidthInches  = 8.27
	a4HeightInches = 11.69
	renderTimeout  = 30 * time.Second
)

type Browser struct {
	allocCtx context.Context
	cancel   context.CancelFunc
}

func NewBrowser() *Browser {
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.NoSandbox,
		chromedp.DisableGPU,
		chromedp.Flag("disable-dev-shm-usage", true),
		chromedp.Flag("disable-extensions", true),
	)
	if path := os.Getenv("PDF_CHROME_PATH"); path != "" {
		opts = append(opts, chromedp.ExecPath(path))
	}

	ctx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	return &Browser{allocCtx: ctx, cancel: cancel}
}

func (b *Browser) Close() {
	if b.cancel != nil {
		b.cancel()
	}
}

func (b *Browser) Render(html string, opts config.Options) ([]byte, error) {
	tabCtx, cancel := chromedp.NewContext(b.allocCtx)
	defer cancel()

	tabCtx, cancelTimeout := context.WithTimeout(tabCtx, renderTimeout)
	defer cancelTimeout()

	media := opts.EmulateMediaType
	if media == "" {
		media = "print"
	}

	var buf []byte
	err := chromedp.Run(tabCtx,
		chromedp.Navigate("about:blank"),
		emulation.SetScriptExecutionDisabled(true),
		emulation.SetEmulatedMedia().WithMedia(media),
		setDocumentContent(html),
		printToPDF(&buf, opts),
	)
	return buf, err
}

func setDocumentContent(html string) chromedp.ActionFunc {
	return func(ctx context.Context) error {
		tree, err := page.GetFrameTree().Do(ctx)
		if err != nil {
			return err
		}
		return page.SetDocumentContent(tree.Frame.ID, html).Do(ctx)
	}
}

func printToPDF(res *[]byte, opts config.Options) chromedp.ActionFunc {
	return func(ctx context.Context) error {
		data, _, err := page.PrintToPDF().
			WithPrintBackground(opts.PrintBackground).
			WithPreferCSSPageSize(false).
			WithPaperWidth(a4WidthInches).
			WithPaperHeight(a4HeightInches).
			WithMarginTop(float64(opts.MarginTop) / pxPerInch).
			WithMarginBottom(float64(opts.MarginBottom) / pxPerInch).
			WithMarginLeft(float64(opts.MarginLeft) / pxPerInch).
			WithMarginRight(float64(opts.MarginRight) / pxPerInch).
			WithGenerateTaggedPDF(true).
			Do(ctx)
		if err != nil {
			return err
		}
		*res = data
		return nil
	}
}
