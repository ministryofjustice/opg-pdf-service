from http.server import BaseHTTPRequestHandler, HTTPServer

from weasyprint import HTML

PORT = 5000


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/generate-pdf":
            self.send_error(404)
            return

        length = int(self.headers.get("Content-Length", 0))
        html = self.rfile.read(length).decode("utf-8")

        try:
            pdf = HTML(string=html).write_pdf()
        except Exception as exc:
            self.send_error(500, str(exc))
            return

        self.send_response(200)
        self.send_header("Content-Type", "application/pdf")
        self.send_header("Content-Disposition", "attachment; filename=download.pdf")
        self.send_header("Content-Length", str(len(pdf)))
        self.end_headers()
        self.wfile.write(pdf)

    def do_GET(self):
        if self.path == "/health-check":
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"OK")
        else:
            self.send_error(404)

    def log_message(self, *_args):
        pass


if __name__ == "__main__":
    HTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
