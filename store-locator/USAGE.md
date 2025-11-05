# How to Run the Store Locator Widget

## Step 1: Build the Bundle

First, build the bundled widget:

```bash
cd store-locator
npm run build
```

This creates `dist/store-locator-widget.js` which contains all JavaScript and CSS bundled together.

## Step 2: Start the Server

Start the Express server that serves:
- The API endpoint (`/locations`) for store data
- The bundled widget files

```bash
npm start
```

Or for development:

```bash
npm run dev
```

The server will start on `http://localhost:4001`

## Step 3: Test the Bundled Widget

### Option A: View the Example Page

Open in your browser:
```
http://localhost:4001/dist/example.html
```

This shows the bundled widget in action.

### Option B: Use in Your Own HTML

Create an HTML file and include the bundled widget:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Store Locator</title>
</head>
<body>
    <h1>Find a Store</h1>

    <!-- Widget container -->
    <div id="store-locator-widget"></div>

    <!-- Load the bundled widget -->
    <script src="http://localhost:4001/dist/store-locator-widget.js"></script>
</body>
</html>
```

### Option C: Embed in Any Website

You can embed the widget in any website by including:

```html
<!-- Add this where you want the widget -->
<div id="store-locator-widget"></div>

<!-- Load the bundle from your server -->
<script src="http://localhost:4001/dist/store-locator-widget.js"></script>
```

## Custom API URL

If your API is on a different server, configure it:

```html
<script src="http://localhost:4001/dist/store-locator-widget.js"></script>
<script>
  StoreLocatorWidget({
    apiUrl: 'https://your-api-server.com'
  });
</script>
```

## Quick Start Summary

```bash
# 1. Build the bundle
npm run build

# 2. Start the server
npm start

# 3. Open in browser
# http://localhost:4001/dist/example.html
```

## Distribution

To distribute the widget to clients:

1. Build the bundle: `npm run build`
2. Share the `dist/store-locator-widget.js` file
3. Clients can host it on their own server or use a CDN
4. They just need to include it in their HTML as shown above

The widget will automatically:
- Inject CSS styles
- Create the widget HTML
- Fetch store data from the configured API endpoint

