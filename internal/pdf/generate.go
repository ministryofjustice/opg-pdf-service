package pdf

import (
	"context"

	"github.com/ministryofjustice/opg-pdf-service/internal/config"
	"github.com/ministryofjustice/opg-pdf-service/internal/htmlprep"
)

func Generate(ctx context.Context, b *Browser, html string, opts config.Options) ([]byte, error) {
	var err error

	if opts.StripTags {
		if html, err = htmlprep.StripAnchorTags(html); err != nil {
			return nil, err
		}
	}

	if opts.EmbedRemoteImages {
		if html, err = htmlprep.EmbedRemoteImages(ctx, html); err != nil {
			return nil, err
		}
	}

	return b.Render(html, opts)
}
