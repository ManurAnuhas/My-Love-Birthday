# Simple PowerShell Static File Server
# Run this to view your site at http://localhost:8080

$port = 8080
$http = [System.Net.HttpListener]::new()
$http.Prefixes.Add("http://localhost:$port/")
$http.Start()

Write-Host "--- Birthday Surprise Server Started ---" -ForegroundColor Cyan
Write-Host "Opening your site at: http://localhost:$port" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server."

# Open browser automatically
Start-Process "http://localhost:$port"

try {
    while ($http.IsListening) {
        try {
            $context = $http.GetContext()
            $request = $context.Request
            $response = $context.Response

            $path = $request.Url.LocalPath
            if ($path -eq "/") { $path = "/index.html" }
            
            # Security: Remove leading slash and combine with current directory
            $relativePath = $path.TrimStart('/')
            $localPath = Join-Path $PSScriptRoot $relativePath

            if (Test-Path $localPath -PathType Leaf) {
                $extension = [System.IO.Path]::GetExtension($localPath).ToLower()
                $contentType = switch ($extension) {
                    ".html" { "text/html" }
                    ".css"  { "text/css" }
                    ".js"   { "application/javascript" }
                    ".jpg"  { "image/jpeg" }
                    ".jpeg" { "image/jpeg" }
                    ".png"  { "image/png" }
                    ".mp3"  { "audio/mpeg" }
                    default { "application/octet-stream" }
                }
                
                $buffer = [System.IO.File]::ReadAllBytes($localPath)
                $response.ContentType = $contentType
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found")
                $response.OutputStream.Write($msg, 0, $msg.Length)
            }
            $response.Close()
        } catch {
            # Ignore broken pipe or other connection errors so server stays alive
            Write-Host "Request error: $_" -ForegroundColor Yellow
        }
    }
} finally {
    $http.Stop()
}
