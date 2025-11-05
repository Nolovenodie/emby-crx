#!/bin/bash

# Define repo base URL
REPO_BASE="https://raw.githubusercontent.com/sohag1192/emby-crx/master"

# Clean and recreate emby-crx directory
rm -rf emby-crx
mkdir -p emby-crx

# Download required files
wget "$REPO_BASE/static/css/style.css" -P emby-crx/
wget "$REPO_BASE/static/js/common-utils.js" -P emby-crx/
wget "$REPO_BASE/static/js/jquery-3.6.0.min.js" -P emby-crx/
wget "$REPO_BASE/static/js/md5.min.js" -P emby-crx/
wget "$REPO_BASE/content/main.js" -P emby-crx/

# Read index.html content
content=$(cat index.html)

# Check if emby-crx is already included
if grep -q "emby-crx" index.html; then
    echo "Index.html already contains emby-crx, skipping insertion."
else
    # Define code to insert
    code='<link rel="stylesheet" id="theme-css" href="emby-crx/style.css" type="text/css" media="all" />
<script src="emby-crx/common-utils.js"></script>
<script src="emby-crx/jquery-3.6.0.min.js"></script>
<script src="emby-crx/md5.min.js"></script>
<script src="emby-crx/main.js"></script>'

    # Insert before </head>
    new_content=$(echo "$content" | sed "s|</head>|$code\n</head>|")

    # Write updated content back to index.html
    echo "$new_content" > index.html
    echo "emby-crx assets injected into index.html."
fi
