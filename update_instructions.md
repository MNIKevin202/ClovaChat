# Update Instructions

Use this checklist to publish a new desktop app release through GitHub Releases with signed macOS builds. Replace the placeholders with the new app's real values.

## Project Values

- App name: `Paycheck Calculator`
- GitHub repo: `OWNER/REPO`
- Release tag format: `vX.Y.Z`
- macOS build script: `npm run dist:mac`
- Windows build script: `npm run dist:win`
- Release source for updates: GitHub Releases, not GitHub Actions artifacts

## One-Time Setup

1. Make sure the app version lives in `package.json`.
2. Make sure the app has build scripts similar to:

```json
{
  "scripts": {
    "dist:mac": "electron-builder --mac dmg zip --publish never",
    "dist:win": "electron-builder --win nsis --publish never"
  }
}
```

3. Make sure GitHub Actions creates a GitHub Release when a version tag is pushed.
4. Make sure the Windows workflow uploads the `.exe` installer to that GitHub Release.
5. Keep macOS signing credentials local unless they are deliberately configured as GitHub Actions secrets.
6. Install and authenticate GitHub CLI:

```bash
gh auth status
```

7. Confirm the Mac has the signing identity:

```bash
security find-identity -v -p codesigning
```

## Release Checklist

1. Start clean.

```bash
git status --short --branch
```

Do not include unrelated local files in the release commit.

2. Run the normal project checks.

```bash
npm install
npm test
```

If the project does not have tests yet, run the strongest available checks, such as linting, type checks, or a local app launch smoke test.

3. Commit the app changes.

```bash
git add <changed-files>
git commit -m "Describe the update"
```

4. Bump the version and create the release tag.

```bash
npm version patch
```

Use `npm version minor` or `npm version major` for larger releases.

If the project requires signed git tags, enable signed tags before the version bump:

```bash
git config tag.gpgSign true
```

5. Build the signed macOS installers locally.

```bash
npm run dist:mac
```

Expected outputs are usually:

```text
dist/AppName-X.Y.Z-arm64.dmg
dist/AppName-X.Y.Z-arm64-mac.zip
```

6. Verify the macOS app signature.

```bash
codesign --verify --deep --strict dist/mac-arm64/AppName.app
```

Optional Gatekeeper assessment:

```bash
spctl --assess --type execute --verbose dist/mac-arm64/AppName.app
```

If the app is signed but not notarized, macOS may still report a warning for downloaded builds. That is expected unless notarization is configured.

7. Push the release commit and tag.

```bash
git push origin main
git push origin vX.Y.Z
```

8. Confirm the GitHub release workflow started.

```bash
gh run list --repo OWNER/REPO --workflow "Release Installers" --limit 5
```

9. Wait for the workflow to finish.

```bash
gh run watch RUN_ID --repo OWNER/REPO --exit-status
```

10. Upload the signed Mac assets to the GitHub Release.

```bash
gh release upload vX.Y.Z \
  dist/AppName-X.Y.Z-arm64.dmg \
  dist/AppName-X.Y.Z-arm64-mac.zip \
  --repo OWNER/REPO \
  --clobber
```

11. Verify the final release assets.

```bash
gh release view vX.Y.Z --repo OWNER/REPO --json url,assets,tagName,isDraft,isPrerelease
```

The release should contain the expected macOS `.dmg`, macOS `.zip`, and Windows `.exe` installer.

12. Smoke test the update path.

- Install the previous released version.
- Open the app.
- Trigger the update check.
- Confirm the app sees the new GitHub Release.
- Confirm it selects the correct installer for the current platform.

## Important Rules

- GitHub Releases are the update channel.
- GitHub Actions artifacts are not the update channel.
- The app version, git tag, release title, and installer filenames should all match.
- Build macOS locally when the signing certificate is only on the Mac.
- Do not upload unsigned Mac builds if the app is expected to ship signed.
- Do not move Mac signing into GitHub Actions until certificates and notarization secrets are intentionally configured.
- Always verify the final GitHub Release contains the exact files the updater expects.

## Quick Command Template

```bash
git status --short --branch
npm test
git add <changed-files>
git commit -m "Describe the update"
npm version patch
npm run dist:mac
codesign --verify --deep --strict dist/mac-arm64/AppName.app
git push origin main
git push origin vX.Y.Z
gh run list --repo OWNER/REPO --workflow "Release Installers" --limit 5
gh run watch RUN_ID --repo OWNER/REPO --exit-status
gh release upload vX.Y.Z dist/AppName-X.Y.Z-arm64.dmg dist/AppName-X.Y.Z-arm64-mac.zip --repo OWNER/REPO --clobber
gh release view vX.Y.Z --repo OWNER/REPO --json url,assets
```
