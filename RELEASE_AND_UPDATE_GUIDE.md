# ClovaChat Release and Update Guide

This file documents what has been set up for ClovaChat, how the updater works, and how to publish new GitHub releases.

## What Has Been Done

- Created and pushed the desktop ClovaChat repo to `MNIKevin202/ClovaChat`.
- Kept private phone app work out of GitHub by ignoring `ios/`.
- Added `.gitignore` for local folders like `node_modules/`, `dist/`, `.DS_Store`, `.claude/`, and `ios/`.
- Added Windows packaging with `electron-builder` NSIS installer output.
- Added a Windows `.ico` icon at `build/icon.ico`.
- Added GitHub Actions:
  - `Build Installers`: builds only the Windows `.exe` artifact on push or PR.
  - `Release Installers`: creates a GitHub Release on version tags and builds/uploads only the Windows `.exe`.
- Changed the Mac release process so GitHub does not build/upload the DMG.
- Mac DMG/zip releases are built locally on Kevin's Mac and manually uploaded to the GitHub Release.
- Added in-app update checking from GitHub Releases.
- Added startup update checks and a manual `Check for Updates` button in Settings.
- Added in-app update documentation in the Docs tab.

## Why Mac DMGs Are Built Locally

GitHub-hosted macOS runners do not have Kevin's local Apple signing identity.

When GitHub builds the DMG, macOS may show:

```text
"ClovaChat" is damaged and can't be opened.
```

The current setup avoids that by:

1. Letting GitHub create the release and build the Windows `.exe`.
2. Building the Mac DMG locally with the local signing identity.
3. Manually uploading the local `dist/ClovaChat-X.Y.Z-arm64.dmg` and zip to the release.

Important: the local Mac build is signed, but it is still not fully notarized. If macOS blocks it, use this local testing workaround after copying ClovaChat to Applications:

```bash
xattr -dr com.apple.quarantine /Applications/ClovaChat.app
```

The permanent polished Mac release fix is Apple Developer ID signing plus notarization.

## How The Updater Works

The app checks:

```text
https://api.github.com/repos/MNIKevin202/ClovaChat/releases/latest
```

It compares the latest release tag, such as `v1.0.4`, against the installed app version from `package.json`.

If the GitHub Release version is newer:

- On Windows, it looks for an asset named like:

```text
ClovaChat-Setup-X.Y.Z-x64.exe
```

- On macOS, it looks for an asset named like:

```text
ClovaChat-X.Y.Z-arm64.dmg
```

When the user accepts the update:

1. ClovaChat downloads the correct installer asset to the system temp folder.
2. ClovaChat asks the OS to open it.
3. ClovaChat stays open and tells the user where the installer was opened from.
4. If opening fails, ClovaChat reveals the downloaded installer in Finder/Explorer.

Important: older builds may still have older updater behavior. For example, `v1.0.0` and some early update tests may close too early or fail to open the downloaded installer. Once a user manually installs a fixed newer version, future updates should use the improved updater.

## Normal Release Steps

From the repo folder:

```bash
cd /Users/kevinpoulos/Documents/Projects/macIRC
```

Make sure the working tree is clean:

```bash
git status --short
```

Bump the version:

```bash
npm version patch
```

This updates `package.json` and `package-lock.json`, creates a commit, and creates a tag like `v1.0.5`.

Push the version commit:

```bash
git push
```

Push the tag:

```bash
git push origin vX.Y.Z
```

Example:

```bash
git push origin v1.0.5
```

GitHub Actions will:

1. Create the GitHub Release.
2. Build and upload the Windows `.exe`.

## Build And Upload The Mac DMG Locally

After pushing the tag, build the Mac installer locally:

```bash
npm run dist:mac
```

For version `vX.Y.Z`, upload the local Mac assets:

```bash
gh release upload vX.Y.Z \
  dist/ClovaChat-X.Y.Z-arm64.dmg \
  dist/ClovaChat-X.Y.Z-arm64-mac.zip \
  --repo MNIKevin202/ClovaChat \
  --clobber
```

Example:

```bash
gh release upload v1.0.5 \
  dist/ClovaChat-1.0.5-arm64.dmg \
  dist/ClovaChat-1.0.5-arm64-mac.zip \
  --repo MNIKevin202/ClovaChat \
  --clobber
```

## Check The Release

Open the release page:

```bash
gh release view vX.Y.Z --repo MNIKevin202/ClovaChat --web
```

Or inspect assets in Terminal:

```bash
gh release view vX.Y.Z --repo MNIKevin202/ClovaChat --json assets,url
```

The release should include:

- `ClovaChat-X.Y.Z-arm64.dmg`
- `ClovaChat-X.Y.Z-arm64-mac.zip`
- `ClovaChat-Setup-X.Y.Z-x64.exe`

## Check The Workflows

List recent runs:

```bash
gh run list --repo MNIKevin202/ClovaChat --limit 5
```

Watch a run:

```bash
gh run watch RUN_ID --repo MNIKevin202/ClovaChat --exit-status
```

The release workflow should only have:

- `Create GitHub Release`
- `Release Windows EXE`

There should be no GitHub-built Mac DMG job.

## Current Important Notes

- Windows updater testing is the cleanest path right now.
- Mac updater can download/open the DMG, but macOS may still complain unless the app is notarized or quarantine is removed.
- GitHub Actions artifacts are not the update source. GitHub Releases are the update source.
- The app reads the latest GitHub Release, not arbitrary Actions artifacts.
- Do not commit or upload `ios/`; it is intentionally private and ignored.
