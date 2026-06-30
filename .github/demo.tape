# VHS Demo — satellite-mcp
Output .github/demo.gif

Set Shell "bash"
Set FontSize 14
Set Width 800
Set Height 500
Set Theme "Catppuccin Mocha"
Set Padding 20
Set TypingSpeed 30ms

# Show help output
Type `satellite-mcp --help`
Sleep 300ms
Enter
Sleep 4s

# List all tool categories
Type `satellite-mcp --list`
Sleep 300ms
Enter
Sleep 6s

# Scroll through tool list
Down 5
Sleep 1s
Down 5
Sleep 1s
Down 5
Sleep 2s

# Calculate NDVI from spectral bands
Type `satellite-mcp --tool spectral_ndvi '{"nir":0.8,"red":0.2}'`
Sleep 300ms
Enter
Sleep 5s

# Calculate geographic distance between Istanbul and Ankara
Type `satellite-mcp --tool geo_distance '{"lat1":41.01,"lng1":28.98,"lat2":39.93,"lng2":32.86}'`
Sleep 300ms
Enter
Sleep 5s

Sleep 2s
