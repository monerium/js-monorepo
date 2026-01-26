# Documentation Releases

This document explains how to access and use the pre-built documentation from GitHub Releases.

## Overview

The developer documentation is automatically built and published in two ways:

1. **GitHub Releases** - Attached to every release (permanent storage)
2. **Latest Build** - Continuously updated `docs-latest` release (always has the newest build from `main`)

All documentation is built with `baseUrl='/developers/'` and packaged as a compressed tarball for easy distribution.

## Download Options

### Option 1: Latest Build (Recommended)

Always get the most recent documentation from the `main` branch:

```bash
# Download
curl -L https://github.com/monerium/js-monorepo/releases/download/docs-latest/developer-docs-build.tar.gz -o docs.tar.gz

# Extract
tar -xzf docs.tar.gz -C ./my-docs-folder

# The files will be in ./my-docs-folder/
```

### Option 2: Specific Release Version

Download documentation from a specific release:

```bash
# Replace v1.2.3 with your desired version
curl -L https://github.com/monerium/js-monorepo/releases/download/v1.2.3/developer-docs-build.tar.gz -o docs.tar.gz
tar -xzf docs.tar.gz -C ./my-docs-folder
```

### Option 3: Manual Download

1. Go to [Releases](https://github.com/monerium/js-monorepo/releases)
2. Find the release you want (or use `docs-latest`)
3. Download `developer-docs-build.tar.gz`
4. Extract it to your desired location

## Using the Documentation

### Serve Locally

After extracting, you can serve the documentation:

```bash
# Using Python
cd my-docs-folder
python3 -m http.server 8000

# Using Node.js http-server
npx http-server my-docs-folder -p 8000

# Using PHP
cd my-docs-folder
php -S localhost:8000
```

Then open: `http://localhost:8000/developers/`

**Important:** The docs are built with `baseUrl='/developers/'`, so you must access them at that path!

### Embed in Your Application

#### Express.js

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve at /developers path
app.use('/developers', express.static(path.join(__dirname, 'my-docs-folder')));

app.listen(3000, () => {
  console.log('Docs at http://localhost:3000/developers');
});
```

#### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /developers/ {
        alias /path/to/my-docs-folder/;
        try_files $uri $uri/ /developers/index.html;
    }
}
```

#### Next.js (Copy to Public)

```javascript
// In your build process or script
const fs = require('fs-extra');
const path = require('path');

// Copy extracted docs to public/developers
fs.copySync(
  path.join(__dirname, 'my-docs-folder'),
  path.join(__dirname, 'public/developers')
);
```

Then docs will be available at `https://yoursite.com/developers/`

## Automated Download in CI/CD

### GitHub Actions

```yaml
- name: Download latest docs
  run: |
    curl -L https://github.com/monerium/js-monorepo/releases/download/docs-latest/developer-docs-build.tar.gz -o docs.tar.gz
    mkdir -p public/developers
    tar -xzf docs.tar.gz -C public/developers
```

### Docker

```dockerfile
FROM nginx:alpine

# Download and extract docs
RUN apk add --no-cache curl \
    && curl -L https://github.com/monerium/js-monorepo/releases/download/docs-latest/developer-docs-build.tar.gz -o /tmp/docs.tar.gz \
    && mkdir -p /usr/share/nginx/html/developers \
    && tar -xzf /tmp/docs.tar.gz -C /usr/share/nginx/html/developers \
    && rm /tmp/docs.tar.gz

EXPOSE 80
```

## What's Included

The tarball contains a complete static website:

```
developer-docs-build.tar.gz
├── index.html
├── 404.html
├── assets/
│   ├── css/
│   └── js/
├── docs/
│   └── api/
├── packages/
│   ├── sdk/
│   └── sdk-react-provider/
└── img/
```

## Release Schedule

- **Latest Build (`docs-latest`)**: Updated on every push to `main`
- **Version Releases**: Created when packages are released via release-please

## Troubleshooting

### Issue: Assets not loading

**Problem:** Seeing 404 errors for CSS/JS files

**Solution:** Ensure you're serving the docs at the `/developers/` path. The documentation is built with `baseUrl='/developers/'` and expects all assets to be relative to that path.

```bash
# ✅ Correct
http://localhost:8000/developers/

# ❌ Wrong
http://localhost:8000/
```

### Issue: Links are broken

**Problem:** Navigation links don't work

**Solution:** Make sure your web server is configured to handle client-side routing. For Nginx:

```nginx
try_files $uri $uri/ /developers/index.html;
```

For Apache:

```apache
RewriteEngine On
RewriteBase /developers/
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /developers/index.html [L]
```

## API

### Get Latest Release Info

```bash
# Get latest release metadata
curl -s https://api.github.com/repos/monerium/js-monorepo/releases/tags/docs-latest | jq .

# Get download URL
curl -s https://api.github.com/repos/monerium/js-monorepo/releases/tags/docs-latest | jq -r '.assets[0].browser_download_url'
```

### Check for Updates

```bash
# Get the latest commit SHA from the release body
curl -s https://api.github.com/repos/monerium/js-monorepo/releases/tags/docs-latest | jq -r '.body'
```

## Storage

- **GitHub Releases**: Stored indefinitely (no expiration)
- **Artifacts** (in Actions): 90 days retention
- **GitHub Pages**: Automatically deployed and hosted

For permanent storage with versioning, always use GitHub Releases!

## Questions or Issues?

- [Open an Issue](https://github.com/monerium/js-monorepo/issues)
- [View Releases](https://github.com/monerium/js-monorepo/releases)
- [Documentation Site](https://monerium.github.io/js-monorepo/)