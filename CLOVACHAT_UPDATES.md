# ClovaChat Updates

## Current App Identity

ClovaChat is a modern Twitch IRC chat client with built-in bot tools, command scripts, popup actions, timed messages, stream preview, logs, auto join, settings, and Twitch-focused workflow tools.

## Completed / Existing Features

- Twitch IRC connection
- Channel tabs
- Movable channel tabs
- Right-click channel tab menu for leaving a channel
- Multi-channel chat
- User list per channel
- Remembered moderator and VIP roles
- Lead moderator and super moderator handling
- User profile drawer for chat and roster usernames
- Roster right-click tools for Monitor and Hide Chats
- Stream preview panel
- Stream preview navigation for multiple channels
- Stream play, pause, mute, unmute, volume, and settings controls
- Per-channel stream player state persistence
- Popup actions
- Command scripts
- mIRC-style command replacements
- Python command scripts
- Timed messages
- Timers Active and Timers Inactive channel status button
- Bot Builder
- Plain-language bot rule wizard
- Channel-specific or all-channel bot rules
- Raw IRC view
- Docs page
- Settings page
- Auto Join sidebar
- One-time `/join #channel` support without adding Auto Join
- Add current channel to Auto Join action
- Server Connection sidebar
- Server tab as a notifications-only channel
- Chat history between sessions
- Channel logs
- Open Logs Folder shortcut
- Backup and restore settings
- Dark mode
- 7TV emotes
- Twitch emotes
- Desktop notifications
- Notify when channel goes live
- Move live channel tabs to the front
- In-app update checks from GitHub Releases
- macOS DMG update download/open flow
- Windows EXE installer builds from GitHub Actions
- Multi-Channel Dashboard
- Per-channel settings

## Emote Picker

- Added an emote button next to the message box that opens a searchable picker with Twitch and 7TV tabs for the active channel's emotes.
- Twitch emotes are fetched from Helix (global emotes plus the channel's emote set) reusing the existing Twitch token/client-id; 7TV emotes reuse the per-channel set already loaded for chat rendering.
- Clicking an emote inserts it into the message box at the cursor.

## Dockable Stream Player & Stale Connection Fix

- The stream player is docked back in the sidebar by default. Dragging it by its toolbar detaches it into a floating, resizable panel that can go anywhere in the window, including on top of chat; dropping it back near the sidebar re-docks it.
- Dock/floating state and the floating panel's position and size are remembered between sessions.
- Fixed chat appearing to silently freeze: the connection card kept showing "Connected" and outgoing messages still sent, but incoming chat from other users stopped arriving because the underlying socket had gone stale (a "zombie" connection with no error or close event). ClovaChat now detects this with a keepalive watchdog and automatically reconnects and rejoins channels.

## Floating Stream Player & Ad-Freeze Fix

- The Twitch stream preview is now a floating overlay panel instead of a fixed pane embedded in the sidebar. It can be dragged anywhere in the window (including on top of chat) and resized from its bottom-right corner.
- The panel's position and size are remembered between sessions.
- Removed the old sidebar-width drag handle that only existed to resize the embedded player.
- Fixed a bug where the stream would get stuck after a Twitch ad break and only resume after fully restarting the app. The player now detects an unexpected stuck/paused state and automatically resumes playback, and the app window no longer throttles background activity while unfocused.

## Visual Polish Pass

Performed a UI polish pass focused on:
- Better spacing consistency
- Improved typography hierarchy
- Cleaner card styling
- Refined sidebar layout
- Improved channel status strip
- More polished dashboard cards
- Better button hierarchy
- Cleaner filters and controls
- Better chat readability
- More cohesive stream panel styling
- Improved user list styling

Purpose:
This pass improves the app's overall visual quality without changing its core layout or workflow.

## Recent UI Upgrade

- Sidebar redesigned into cleaner sections
- Smaller ClovaChat logo
- Connection status card added
- Server, nick, and joined channel count shown
- Open Logs Folder shortcut added
- Stream controls kept visible while removing the bulky stream title overlay
- Docs button added to the main workspace navigation
- Server tab cleaned up so it does not show roster, popups, auto-join actions, quick chat buttons, or the message composer

## Current Upgrade

- Added a first-launch Onboarding Wizard with welcome, Twitch connection, channel setup, layout choices, starter tools, and finish summary steps.
- Onboarding completion is saved locally, can be skipped, and can be run again from Settings.
- Starter tools can add beginner commands, a follow reminder timer, and a wave popup without duplicating existing tools.
- Improved the chat message UI with global Chat Display settings for timestamps, badges, emotes, system messages, mention highlighting, grouped messages, density, font size, hover actions, moderator hover tools, and reduced motion.
- Chat now supports slash-command autocomplete, sent-message history with Up and Down, hover actions, username right-click actions, status message levels, and a New Messages button when the user is scrolled up.
- Added Reset ClovaChat to First Install in Settings with typed RESET confirmation, optional local history/log/old-backup deletion, automatic backup creation, disconnect, and onboarding restart.
- Updated the in-app Docs for onboarding, chat display, hover actions, command autocomplete, message history, and reset behavior.

## Requested Upgrade 10: Reset to First Install

Add a Settings Danger Zone reset flow that can return ClovaChat to a first-install state.

The reset flow should include:

- A clear reset button in Settings
- A confirmation modal
- Typed RESET confirmation
- Automatic backup before reset
- Optional deletion of local chat history
- Optional deletion of channel logs
- Optional deletion of old backups
- Clearing saved channels, commands, timers, popups, bot rules, notes, and preferences
- Showing the Onboarding Wizard again after reset

Purpose:
This gives users a safe way to start over without manually hunting through local app data.

## Requested Upgrade 9: Improved Chat Message UI

Improve the chat message experience so ClovaChat feels more like a serious Twitch chat client.

The chat UI should include:

- Better message spacing and density options
- Timestamp, badge, emote, and system message display controls
- Mention highlighting
- Optional grouped consecutive messages
- Hover actions for mention, copy, and profile
- Moderator hover tools when the connected account can moderate
- Username right-click actions
- New Messages button while scrolled up
- Sent message and command history
- Slash-command autocomplete
- Reduced motion setting

Purpose:
This makes active chat easier to read, moderate, and move through quickly.

## Requested Upgrade 8: Onboarding Wizard

Add a first-launch setup wizard that guides users through the most important setup steps.

The wizard should include:

- Welcome
- Connect Twitch Chat
- Add Channels
- Choose Layout
- Starter Tools
- Finish

It should save completion locally, avoid duplicate starter tools, and be available again from Settings.

Purpose:
This helps new users get connected and productive without needing to understand every setting first.

## Previous Upgrade

- Added Per-Channel Settings.
- Channel settings are stored by normalized channel name and fall back to global defaults when no override exists.
- Added Channel Settings access from the active channel status strip, channel tab right-click menu, Multi-Channel Dashboard actions, Settings, and the Command Palette.
- Added a Channel Settings modal with sections for General, Chat, Bot, Commands, Timers, Popups, Moderation, Logs, Notifications, and Stream Preview.
- Each setting shows whether it is using a Global Default or Channel Override.
- Added Reset to Global Default per setting, Reset Channel Settings, Copy Settings From Another Channel, and Apply These Settings To All Channels.
- Per-channel settings now affect chat display, badges, timestamps, compact mode, font size, mention highlighting, highlighted users, bot message hiding, repeated message hiding, bot auto-replies, commands, timers, popups, logs, notifications, stream preview defaults, favorites, display names, and Auto Join.

## Requested Upgrade 6: Per-Channel Settings

Add channel-specific settings so each Twitch channel can have its own chat display, bot behavior, commands, timers, popups, logs, notifications, stream preview, and moderation preferences.

The system should support:

- Global defaults
- Channel-specific overrides
- Reset to global default
- Copy settings from another channel
- Apply settings to all channels
- Per-channel auto join
- Per-channel favorite status
- Per-channel logs
- Per-channel stream preview behavior

Purpose:
This allows ClovaChat to scale from a simple single-channel chat client into a flexible multi-channel Twitch control center.

## Previous Upgrade

- Added a Multi-Channel Dashboard workspace view.
- The dashboard shows joined and auto-join channels in one place.
- Channel cards show live status, viewer count, category, stream title, chat users, session messages, activity speed, last message, bot status, timer status, and log status.
- Dashboard actions open chat, open stream preview, join or leave, add or remove Auto Join, run a popup, open logs, and jump to Settings.
- Sorting supports live channels first, most active chat, alphabetical, recently active, and most viewers.
- Filtering supports all channels, live, offline, active chat, auto join, and bot enabled.
- Stream status data reuses the existing throttled Twitch live poll instead of adding extra request loops.

## Requested Upgrade 5: Multi-Channel Dashboard

Add a dashboard view that shows all joined channels in one place with live status, viewer count, chat activity, user count, last message, bot status, timer status, and log status.

The dashboard should include:

- Channel cards or a table layout
- Live/offline indicators
- Viewer count if available
- Category/game if available
- Stream title if available
- Chat user count
- Session message count
- Chat activity speed
- Last message preview
- Quick actions for each channel
- Sorting and filtering options

Purpose:
This turns ClovaChat into a true multi-channel Twitch command center instead of requiring the user to jump between tabs to understand what is happening.

## Previous Upgrade

- Added a Command Palette opened with Cmd+K on macOS and Ctrl+K on Windows/Linux.
- The palette searches channels, users, settings, timers, popups, bot rules, command scripts, stream controls, and app navigation.
- It supports keyboard movement with Up/Down, Enter to run, and Escape to close.
- Recent actions appear before typing.
- Destructive actions require confirmation before running.
- Disabled actions stay visible with a reason when the action is not currently available.

## Command Palette Actions

- Channel actions: join a channel once, leave current channel, switch joined channels, add current channel to Auto Join, remove channels from Auto Join, and open the logs folder.
- Chat actions: focus message input, clear the local chat view, copy current channel name, mention a user, and open a user profile drawer.
- Bot and command actions: open Bot Builder, open Commands, create a new command, open an existing command script, and toggle bot rules.
- Timer actions: open Timers, create a new timer, pause or resume timers, send a timer now, and search timers.
- Popup actions: run configured popup buttons, open Popups, and create a new popup.
- Stream actions: show, hide, play, pause, mute, unmute, next stream, and previous stream.
- App navigation: open Chat, Bot, Commands, Popups, Timers, Raw, Docs, and Settings.

## Updating Flow

- ClovaChat reads the app version from `package.json`.
- On startup, the renderer asks the main process to check GitHub Releases.
- The main process compares the current version with the newest GitHub release tag.
- If the release is newer and has an installer for the current platform, ClovaChat prompts the user.
- If the user accepts, ClovaChat downloads the installer to a temporary update folder.
- On Windows, the downloaded `.exe` installer is opened and the app quits after the OS starts the installer.
- On macOS, the downloaded `.dmg` is opened and the app quits after LaunchServices starts opening the disk image.
- If automatic opening fails, the app shows the downloaded installer in Finder or File Explorer so it can be opened manually.

## GitHub Uploading / Release Flow

- The public repo is `MNIKevin202/ClovaChat`.
- The iOS / phone app files should be excluded from the public desktop repo.
- GitHub Actions should build only the Windows `.exe` installer.
- macOS DMG files should be built and signed locally, then uploaded as release assets.
- A new update requires bumping `package.json` to the new version, committing the app changes, tagging the version, and publishing a GitHub Release with matching installer assets.
- Release tags should use the format `v1.2.9`, `v1.3.0`, and so on.

## Local Build Notes

- Install dependencies with `npm install` or `npm ci`.
- Run the app locally with `npm start`.
- Build macOS installers locally with `npm run dist:mac`.
- Build the Windows installer with `npm run dist:win` on Windows or through GitHub Actions.
- The macOS build uses `electron-builder` with DMG and ZIP targets.
- The Windows build uses `electron-builder` with an NSIS installer target.

## Requested Next Upgrades

- Keep expanding the Command Palette as new features are added.
- Consider adding direct delete actions to the palette for timers, commands, popups, or bot rules only if they include confirmation prompts.
- Consider adding channel/user moderation palette actions such as timeout and ban only if moderator permissions are detected and the confirmation copy is very clear.
