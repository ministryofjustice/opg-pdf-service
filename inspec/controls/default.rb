title 'PDF Service Endpoints'

control 'Healthcheck' do
  title 'PDF Service Healthcheck'
  desc 'PDF Service Healthcheck'
  describe http('localhost/health-check') do
    its('status') { should eq 200 }
  end
end

control 'Generation' do
  title 'PDF Generation'
  desc 'Generate a valid PDF'
  describe http(
    'localhost/generate-pdf',
    method: 'POST',
    headers: {'Content-Type' => 'text/html'},
    data: '{<html><head></head><body><p><a href="/home" class="govuk-link">Test with no links</a></p></body></html>0i9}') do
    its('status') { should eq 200 }
    its('headers.Content-Disposition') {should cmp 'attachment; filename=download.pdf'}
  end
end
