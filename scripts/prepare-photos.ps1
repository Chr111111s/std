$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$projectDirectory = if ($PSScriptRoot) { Split-Path -Parent $PSScriptRoot } else { (Get-Location).Path }
$sourceDirectory = Join-Path $projectDirectory 'resources'
$outputDirectory = Join-Path $projectDirectory 'public/photos'
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
$jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$metadata = [ordered]@{}

Get-ChildItem -LiteralPath $sourceDirectory -Filter '*.jpg' | ForEach-Object {
  $sourceFile = $_
  $photo = [System.Drawing.Image]::FromFile($sourceFile.FullName, $true)
  try {
    if ($photo.PropertyIdList -contains 274) {
      $orientation = [BitConverter]::ToUInt16($photo.GetPropertyItem(274).Value, 0)
      switch ($orientation) {
        2 { $photo.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX) }
        3 { $photo.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
        4 { $photo.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipX) }
        5 { $photo.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipX) }
        6 { $photo.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
        7 { $photo.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipX) }
        8 { $photo.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
      }
    }
    $variants = @()
    foreach ($targetWidth in @(640, 1440)) {
      $width = [Math]::Min($targetWidth, $photo.Width)
      $height = [int][Math]::Round($photo.Height * $width / $photo.Width)
      $bitmap = [System.Drawing.Bitmap]::new($width, $height)
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      $encoderParameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
      $encoderParameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]85)
      try {
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.DrawImage($photo, 0, 0, $width, $height)
        $fileName = $sourceFile.BaseName.ToLowerInvariant() + '-' + $width + '.jpg'
        $bitmap.Save((Join-Path $outputDirectory $fileName), $jpegEncoder, $encoderParameters)
        $variants += [ordered]@{ src = '/photos/' + $fileName; width = $width; height = $height }
      } finally {
        $encoderParameters.Dispose()
        $graphics.Dispose()
        $bitmap.Dispose()
      }
    }
    $metadata[$sourceFile.BaseName] = [ordered]@{
      src = $variants[-1].src
      srcSet = ($variants | ForEach-Object { $_.src + ' ' + $_.width + 'w' }) -join ', '
      width = $variants[-1].width
      height = $variants[-1].height
    }
  } finally {
    $photo.Dispose()
  }
}

[System.IO.File]::WriteAllText((Join-Path $projectDirectory 'src/data/photos.generated.json'), ($metadata | ConvertTo-Json -Depth 4), [System.Text.UTF8Encoding]::new($false))
Get-ChildItem -LiteralPath $outputDirectory -File | Measure-Object -Property Length -Sum | Select-Object Count, Sum
