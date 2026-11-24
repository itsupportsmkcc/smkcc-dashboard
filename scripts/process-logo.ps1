Add-Type -AssemblyName System.Drawing

$inputPath = "C:\Users\User\.gemini\antigravity\brain\6cf765ef-9b10-4a68-b051-95104209fc97\.user_uploaded\media_1795491855256_2fcf9bfd.jpg"
$outputPath = "d:\DashboardSystem\public\logo-smkcc.png"

$orig = [System.Drawing.Bitmap]::FromFile($inputPath)
$w = $orig.Width
$h = $orig.Height
Write-Host "Processing image: ${w}x${h}"

# Create 32-bit ARGB bitmap
$bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Lock bits for fast processing
$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$origLock = $orig.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bmpLock = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$bytes = $origLock.Stride * $h
$srcPixels = New-Object byte[] $bytes
$dstPixels = New-Object byte[] $bytes

[System.Runtime.InteropServices.Marshal]::Copy($origLock.Scan0, $srcPixels, 0, $bytes)

# Process every pixel (BGRA format in 32bppArgb)
for ($i = 0; $i -lt $bytes; $i += 4) {
    $b = [int]$srcPixels[$i]
    $g = [int]$srcPixels[$i + 1]
    $r = [int]$srcPixels[$i + 2]
    
    # Calculate luminance / brightness
    # Distance to pure white (255, 255, 255)
    $diffR = 255 - $r
    $diffG = 255 - $g
    $diffB = 255 - $b
    
    # Color distance from white
    $dist = [Math]::Sqrt($diffR * $diffR + $diffG * $diffG + $diffB * $diffB)
    
    # Thresholds:
    # If dist < 8 -> pure background, completely transparent
    # If dist > 45 -> full opacity
    # Between 8 and 45 -> smooth alpha transition with de-fringing
    if ($dist -lt 10) {
        $dstPixels[$i] = 0
        $dstPixels[$i + 1] = 0
        $dstPixels[$i + 2] = 0
        $dstPixels[$i + 3] = 0
    }
    elseif ($dist -lt 50) {
        $alpha = [Math]::Min(255, [int](($dist - 10) / 40.0 * 255))
        # Unmultiply white to prevent white fringe on dark background
        $ratio = [Math]::Max(0.01, $alpha / 255.0)
        $newR = [Math]::Min(255, [Math]::Max(0, [int](($r - 255 * (1 - $ratio)) / $ratio)))
        $newG = [Math]::Min(255, [Math]::Max(0, [int](($g - 255 * (1 - $ratio)) / $ratio)))
        $newB = [Math]::Min(255, [Math]::Max(0, [int](($b - 255 * (1 - $ratio)) / $ratio)))
        
        $dstPixels[$i] = [byte]$newB
        $dstPixels[$i + 1] = [byte]$newG
        $dstPixels[$i + 2] = [byte]$newR
        $dstPixels[$i + 3] = [byte]$alpha
    }
    else {
        $dstPixels[$i] = [byte]$b
        $dstPixels[$i + 1] = [byte]$g
        $dstPixels[$i + 2] = [byte]$r
        $dstPixels[$i + 3] = 255
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($dstPixels, 0, $bmpLock.Scan0, $bytes)

$orig.UnlockBits($origLock)
$bmp.UnlockBits($bmpLock)

$orig.Dispose()

# Ensure public dir exists
$outDir = [System.IO.Path]::GetDirectoryName($outputPath)
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Host "Transparent logo saved successfully to: $outputPath"
