# Launchpad — React launch planner

[![Deploy to Simplifyd Cloud](https://simplifyd.com/deploy-button.svg)](https://console.cloud.simplifyd.com/deploy?repo=https%3A%2F%2Fgithub.com%2FSimplifydCloud%2Fsample-react-launchpad)

[![CI](https://github.com/SimplifydCloud/sample-react-launchpad/actions/workflows/ci.yml/badge.svg)](https://github.com/SimplifydCloud/sample-react-launchpad/actions/workflows/ci.yml)

A small mission control for your next big idea. A responsive React + Vite app with a working three-stage task board, team filters, search, live launch progress, JSON export, and browser persistence. No account, backend, or API key required.

![Launchpad preview](docs/preview.png)

## Try it locally

Use **Use this template → Create a new repository**, or clone the sample:

```sh
git clone https://github.com/SimplifydCloud/sample-react-launchpad.git
cd sample-react-launchpad
npm ci
npm run dev
```

Requires **Node 22.12+**. Open the URL printed by Vite. Create a task, move it to Shipped, reload, and watch your progress stick. **Reset demo** restores the starting board. Browser storage is local to the current origin; sharing a URL does not share a board.

## Deploy on Simplifyd Cloud

### Deploy with the button

Click **Deploy to Simplifyd Cloud** above, sign in, and choose a workspace and project. Review the web service (1 vCPU, 256 MB), confirm, then deploy it from the canvas. The button creates a container service using the public, prebuilt `ghcr.io/simplifydcloud/sample-react-launchpad:1.0.0` image and the settings in `simplifyd.json`. Normal compute usage charges apply.

For a static-site deployment, or to build your own source changes, follow the GitHub flow below.

### Deploy as a static site

1. Create a repository from this template in your GitHub account.
2. In your Simplifyd project, choose **Add → Static Site** and apply the change.
3. Open the site's **Settings → Build → Deploy from GitHub**, connect GitHub, and grant the Simplifyd GitHub App access to your new repository.
4. Select your repository and `main` branch. Keep the app directory at the repository root.
5. Detect the framework, then review these settings and build:

| Setting | Value |
| --- | --- |
| Node | `22` |
| Install | `npm ci` |
| Build | `npm run build` |
| Output directory | `dist` |
| Environment variables | None |

Open the Site URL. Future pushes to `main` build new releases. The Releases tab has logs and rollback. Managed GitHub builds must be enabled on your Simplifyd installation.

For a manual upload, run `npm run build`, zip the **contents** of `dist` with `index.html` at the zip root, and upload it in the site's Files tab. You can also serve the same build as a container:

```sh
docker build -t launchpad .
docker run --rm -p 8080:8080 launchpad
```

## Checks

```sh
npm run build
npx playwright install chromium
npm test
```

Browser tests cover creating, moving, persisting, searching, and deleting tasks, plus mobile overflow. GitHub Actions runs the build and Chromium tests on every push and pull request.

## Make it yours

- Edit the seed board in `src/main.jsx`.
- Change the brand and palette in `src/style.css`.
- Replace browser storage with an API when you need a shared board.

React handles the UI; Vite produces static files; Nginx is only used for the optional container. `vite preview` is a local verification server.

[More Simplifyd samples](https://github.com/SimplifydCloud/sample-projects) · [Vite deployment documentation](https://vite.dev/guide/static-deploy) · MIT licensed.

## Maintaining the deploy image

The **Publish deploy image** GitHub Actions workflow publishes a Linux AMD64 image on a `v*` tag or a manual run with a version. For a new release, run the app checks, publish the new version, then update the image tag in `simplifyd.json`. A newly created GHCR package must be made public in its package settings before the button can pull it anonymously. Forks can publish images to their own namespace and update the manifest accordingly.
