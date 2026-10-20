# Online editor setup (v1.38) — for the site owner
> Latest markdown audit: 2026-10-20 (photo-room screenshot follow-up).

With this one-time setup the customer can edit the gallery on the deployed site
and press **„Veröffentlichen“**. A small save service (a Cloudflare Worker)
checks each save package and writes it as **one commit** to this repository.
The existing GitHub Pages deploy then rebuilds the gallery, which takes about
2 minutes.

```
Editor (GitHub Pages) ──login/publish──▶ Save service (Cloudflare Worker) ──GitHub App──▶ content/edits ─PR─▶ main ─▶ Pages deploy
```

Without this setup nothing changes: the editor works as before and offers
"Konfiguration herunterladen" only.

## What you need

- A free Cloudflare account: <https://dash.cloudflare.com/sign-up>.
- Node.js (already needed for the project).
- About 30 minutes.

## 1. Create the GitHub App (repository access only)

1. Open <https://github.com/settings/apps/new>.
2. Fill in the basics:
   - **Name:** for example `freyraum-save-service`. The name must be unique on GitHub.
   - **Homepage URL:** your gallery address, for example `https://sebohasee.github.io/Freyraum/`.
   - **Webhook:** untick "Active". No webhook is needed.
3. Under **Repository permissions**, set:
   - **Contents:** Read and write. This lets the service create the commit.
   - **Pull requests:** Read and write. This lets it create, comment on and merge the PR.
   - **Actions:** Read-only. This is optional; the editor uses it to show whether the deploy failed.
   - Everything else stays on "No access".
4. Under **Where can this GitHub App be installed?**, choose **Only on this account**, then click **Create GitHub App**.
5. Note the **App ID** shown at the top of the App page.
6. Further down the same page, click **Generate a private key**. A `.pem` file is downloaded.
   - Keep it safe and never commit it.
   - The service accepts it as is (`BEGIN RSA PRIVATE KEY` or `BEGIN PRIVATE KEY`).
7. Click **Install App** in the left menu, then **Install** on your account.
   - Choose **Only select repositories** and select **Freyraum**.
8. Read the **installation ID**: it is the number at the end of the URL after installing, `https://github.com/settings/installations/<installation-id>`.

## 2. Deploy the save service

```bash
cd worker
npx wrangler login                 # opens Cloudflare in the browser
```

1. Edit `worker/wrangler.toml` and fill in the two values (they are not secret):
   - `GITHUB_APP_ID = "<App ID>"`
   - `GITHUB_INSTALLATION_ID = "<installation ID>"`
2. Check that `ALLOWED_ORIGIN` is your gallery address, scheme and host only, for example `https://sebohasee.github.io`. Requests from any other site are refused.
3. Set the secrets. Each command asks for the value; it is stored only at Cloudflare.

```bash
npx wrangler secret put EDITOR_PASSWORD         # the customer password (12+ characters recommended)
npx wrangler secret put SESSION_SECRET          # 32+ random characters, e.g. from: openssl rand -base64 48
npx wrangler secret put GITHUB_APP_PRIVATE_KEY < path/to/your-app.private-key.pem
npx wrangler deploy
```

`wrangler deploy` prints the service address, for example
`https://freyraum-save-service.<your-name>.workers.dev`.

## 3. Connect the gallery to the service

1. Open the repository on GitHub and go to **Settings → Secrets and variables → Actions → Variables**.
2. Click **New repository variable**:
   - **Name:** `FREYRAUM_SAVE_SERVICE_URL`.
   - **Value:** the address from step 2 (https only, no trailing path).
3. Run the deploy again: **Actions → Deploy to GitHub Pages → Run workflow**.

The build writes `editor-online.json` next to the gallery. It contains the
service address and the commit the site was built from. The editor uses this
commit for the conflict check ("Neuere Version vorhanden – bitte neu laden")
and to detect when a publish is live.

## 4. Choose how publishes go live

`PUBLISH_MODE` in `worker/wrangler.toml`:

- **`pull-request`** (default): every publish creates or updates a pull request
  from `content/edits`. The editor shows "Wartet auf Freigabe". You review it
  on GitHub and merge it, and the gallery updates about 2 minutes later.
- **`auto-merge`**: the service merges the pull request immediately. The editor
  shows "Wird veröffentlicht (~2 Min)" and then "Online ✓". Every change is
  still a commit and can be undone.

After changing it, run `npx wrangler deploy` again.

## Change the password

```bash
cd worker
npx wrangler secret put EDITOR_PASSWORD
```

Changing the password signs out every open editor session immediately. The
session key is derived from the password.

## Optional: shared login limits

Failed logins are limited to 5 per 15 minutes per address. Without extra setup
each Worker instance counts on its own. For one shared counter:

```bash
npx wrangler kv namespace create LOGIN_LIMITS
```

Then add the printed `id` to the commented `[[kv_namespaces]]` block in
`wrangler.toml` and deploy again.

## What the service checks

Every save package is checked on the server (`src/online/publishRules.ts`,
shared with the editor):

- **Paths:** only `customer-artworks/museum-hub.json`,
  `customer-artworks/Backgrounds/<name>` and `customer-artworks/inbox/<name>`.
  Names must be lowercase, and existing files are never overwritten.
- **Images:** real PNG, JPEG or WebP content (the file signature is checked,
  not just the file ending).
  - At most 15 MB per image and 40 MB per publish.
  - The editor scales images down to 4096 px on the long side.
- **Layout:** the layout must be a valid museum-hub configuration.
  - Fixed fields (camera, room, stage, hanging rules, wall ids/roles) cannot change.
  - Every placed artwork must exist.
- **Version check:** if someone changed the customer content in the meantime,
  the publish is refused instead of overwritten.

The deploy additionally runs `npm run validate:deploy` before building. A
broken publish fails the deploy, and the live gallery stays on the last good
version. After each deploy, the `smoke` job opens the live gallery and checks
rooms, artworks, the background, and missing files.

## Logs, history and undo

- Every publish is logged in the Worker log with its time, commit and pull
  request. Open it in the Cloudflare dashboard under **Workers → freyraum-save-service → Logs**.
- In the editor, **Speichern → Frühere Version wiederherstellen** lists the last
  10 published layouts. Restoring one creates a new commit; uploaded images are kept.
- Every change is also a normal commit, so you can revert it on GitHub.

## Test locally

```bash
npm run test:save-service      # Worker against a fake GitHub (login, limits, refusals, one commit, PR/auto-merge, restore)
npm run test:validate-deploy   # deploy check fixtures (case, missing image, unknown artwork ID)
npm run import:artworks && npm run build && npm i --no-save playwright
FREYRAUM_CHROME_PATH=/usr/bin/google-chrome npm run test:editor-publish   # editor with a fake service
```
