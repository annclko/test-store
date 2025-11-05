# Integrating the Store Locator Widget with Your Client

## Quick Setup

The bundled widget can be used in your `client` folder. Here's how:

### Option 1: Copy to Client Public Folder (Recommended)

1. **Build the bundle** (from `store-locator` folder):
```bash
cd store-locator
npm run build
```

2. **Copy the bundle to client public folder**:
```bash
cp dist/store-locator-widget.js ../client/public/
```

3. **Use in your client HTML**:
```html
<div id="store-locator-widget"></div>
<script src="/store-locator-widget.js"></script>
```

### Option 2: Reference from Store Locator Server

If you want to keep the bundle on the store-locator server:

1. **Start the store-locator server**:
```bash
cd store-locator
npm start
```

2. **Reference it in your client HTML**:
```html
<div id="store-locator-widget"></div>
<script src="http://localhost:4001/dist/store-locator-widget.js"></script>
```

## Running Your Client

1. **Start the store-locator API server** (in one terminal):
```bash
cd store-locator
npm start
```

2. **Start your Vite client** (in another terminal):
```bash
cd client
npm run dev
```

3. **Open in browser**:
```
http://localhost:5173/store-locators.html
```

## Custom API URL

If your API is on a different server, configure it:

```html
<script src="/store-locator-widget.js"></script>
<script>
  StoreLocatorWidget({
    apiUrl: 'http://localhost:4001'  // Your API endpoint
  });
</script>
```

## Build Process

To keep the bundle updated in your client:

1. Make changes to widget code in `store-locator/src/`
2. Build: `cd store-locator && npm run build`
3. Copy to client: `cp dist/store-locator-widget.js ../client/public/`
4. Refresh your client app

Or add a script to `store-locator/package.json`:
```json
"copy-to-client": "cp dist/store-locator-widget.js ../client/public/"
```

Then run: `npm run build && npm run copy-to-client`

