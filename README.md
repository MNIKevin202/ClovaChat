# ClovaChat

ClovaChat is a desktop Twitch/IRC chat client with stream watching, Twitch and 7TV emotes, popup actions, timed messages, custom commands, and a self-hosted bot builder.

## Run locally

```bash
npm install
npm start
```

## Build installers

macOS DMG:

```bash
npm run dist:mac
```

Windows installer:

```bash
npm run dist:win
```

Installers are written to `dist/`.

## GitHub Actions

The `Build Installers` workflow builds:

- macOS `.dmg` and macOS `.zip` on `macos-latest`
- Windows `.exe` installer on `windows-latest`

Artifacts are uploaded from each workflow run.

## Twitch setup

Use:

- Server: `irc.chat.twitch.tv`
- Port: `6697`
- TLS: enabled
- Nick: your Twitch username
- Password: `oauth:...`
- Channel: `#channelname`

Use the **Twitch Preset** button to fill the IRC settings. Use **Get Token** to open Twitch Token Generator, then create a token with `chat:read`, `chat:edit`, and `moderator:read:chatters` if you want automatic Twitch rosters.

## Commands

Built-in commands include:

- `/join #channel`
- `/part [#channel]`
- `/msg target message`
- `/nick nickname`
- `/me action`
- `/raw IRC command`
- `/disconnect`

Command scripts can be created from the Commands tab. mIRC commands support `$1`, `$2`, `$*`, `$channel`, and `$nick`. Python commands can print one command or message per line, or call `send("message")`.

## Bot Builder

The Bot tab lets your connected account answer chat automatically. Rules can target all channels, the current channel, or specific channels. Simple replies support `{user}`, `{channel}`, `{message}`, and `{args}`. Advanced rules can use Python.

## Timers, popups, and docs

Timed messages, popup actions, stream controls, roster tools, and settings are documented inside the app from the Docs tab.
