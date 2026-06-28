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

## Layout Choice in Onboarding

- The onboarding wizard's "Choose Your Chat Layout" step now lets new users pick Standard or Twitch Style via the same visual frame previews used in Settings, instead of only toggle checkboxes.
- The frames are placeholder CSS drawings for now; real screenshot/PNG previews may replace them later.

## Sidebar Simplification & Stream/Chat Reorg

- Server Connection moved from a sidebar accordion into a modal opened from a button on the connection card.
- Removed the Auto Join accordion. The sidebar's Add channel field now always saves the channel for auto-join, joins it immediately if connected, and switches to it — there's no separate "join once" path anymore.
- The stream area now hides and shows a "Disconnected from chat" empty state (with a Connect button) when the IRC connection drops, instead of leaving a stale video on screen.
- Catch Up clears any manual-pause flag and retries play automatically; if playback is still blocked after a short delay, it shows "click Play to resume" instead of silently doing nothing.
- Popups (Wave/Say hello/etc.) moved to sit directly above the message input. Channel Settings and Mentions moved to a small action row under the video, alongside a new Open Stream in Browser button.
- Renamed the "Chat" tab to "Streams/Chat" in the top navigation.

## Real Layout Preview Screenshots

- Replaced the placeholder CSS-drawn layout frames (in Settings and the onboarding wizard) with real screenshots (`images/StandardStyle.png`, `images/TwitchStyle.png`).

## Sidebar Overhaul: Connect Button, Join Channel, Taller List

- Fixed the actual Disconnect bug: a stale-connection guard added earlier for the auto-reconnect watchdog (`this.socket !== socket` check in the `close` handler) was also silently swallowing the close event from a manual disconnect, since `this.socket` gets nulled before that event fires. The IRC manager now removes the `close` listener and emits `disconnected` itself when you disconnect on purpose.
- Added a single state-driven Connect/Disconnect button to the connection card (with a "Connecting.../Disconnecting..." loading state), so you don't need to dig into the Server Connection accordion just to reconnect.
- Added a "Enter channel name..." input + Join button above the channel list.
- The channel list section now flex-grows to fill available sidebar height instead of stopping at a fixed ~260px.
- Enlarged the top-nav logo (26px → 42px) and the nav bar height (56px → 64px) to give branding more presence.

## Stream Card & Empty States

- In Twitch Style layout, merged the stream header, video, and action row into one bordered card that sizes to its own content (header + 16:9 video + actions) instead of stretching to fill the column, removing the dead space that used to sit above the video.
- Added a "No stream selected" empty state for the stream card, a "No channel selected" empty state in chat, and reworded the no-messages state to "No messages yet — say hello to start the chat."
- Made the stream toolbar buttons taller (30px) and more visually consistent.

## Chat Header & Composer Polish

- Removed the horizontal scrollbar on the chat header pill row — pills wrap to a new line instead of scrolling.
- The message input now shows "Message #channel..." for the active channel and disables itself with a clear placeholder ("Connect to start chatting...", "Select a channel to chat") when disconnected or no channel is active, instead of letting you type into a box that can't send.

## Fix Missing Top Nav Tabs

- Fixed a CSS specificity bug: a later `.tabs { display: grid; grid-template-columns: repeat(2, 1fr); }` rule (left over from the old sidebar grid) was overriding the top nav's flex layout, squeezing all 10 workspace buttons into a clipped 2-column grid so only Dashboard and Chat were visible.

## Top Navigation Polish

- Restyled the top navigation bar: taller, transparent-by-default tab links with an underline-style active state (instead of boxy mismatched buttons that all looked the same), and a divider between the logo and the tabs.

## Navigation Layout Swap

- Moved the workspace navigation (Dashboard, Chat, Bot, Commands, Popups, Timers, Raw, Docs, What's New, Settings) into a new top bar that spans the window, instead of a button grid in the sidebar.
- Moved the channel list into the left sidebar (below the Stream section), instead of a tab row across the top of the Chat view.
- Applies to both Standard and Twitch Style layouts.

## Disconnect Popup

- When the IRC connection drops unexpectedly, ClovaChat now shows a popup ("You've been disconnected") with Reconnect and Dismiss actions, instead of silently going offline.
- Clicking Disconnect yourself does not trigger the popup — it's reserved for unexpected drops.

## Stream Latency Display & Catch Up

- Added a live-updating delay indicator to the stream toolbar (e.g. "4.2s behind"), pulled from the Twitch embed's playback stats (`hlsLatencyBroadcaster`), highlighted when delay gets unusually high.
- Added a Catch Up button that briefly pauses and resumes the player to nudge it closer to the live edge. Twitch's public embed API has no direct seek-to-live method, so this relies on the common trick of forcing a resync via pause/resume.

## Bigger Mentions Button

- Moved the Mentions button to sit under the popup action row instead of floating near the channel tabs, and made it bigger with a visible label instead of a small icon-only circle.

## Mentions in a Modal

- Converted the @ button's mentions list from a small anchored dropdown into a proper centered popup/modal (with backdrop, close button, and a Clear all action), matching the look of the Command Palette and Channel Settings modals.

## Mention Badges & Mentions Panel

- Channel tabs show a small @ badge when you're mentioned in a channel you're not currently viewing.
- Added an @ button above the channel tabs that opens a panel listing every recent mention (across all channels), with channel, nick, and a text preview; clicking one switches to that channel and scrolls to/flashes the message.

## Stream Player Follows the Active Channel

- Switching channel tabs now switches the stream player to that channel's stream automatically, instead of leaving it locked on whichever streamer was last explicitly selected.
- Since there's only one stream player instance, leaving a tab now reliably stops that streamer's video rather than leaving it running while you're elsewhere.

## Twitch Style Sizing Fix & Sidebar Cleanup

- Fixed a row-track mismatch left over from the layout refactor that caused the stream/chat area to collapse to a small box instead of filling the available height on channels with little or no chat.
- Removed the sidebar's vertical channel list in Twitch Style since the top channel tabs already serve that purpose.

## Twitch Style Layout Refactor

- Rebuilt the Twitch Style layout as a real 3-column experience: condensed sidebar (with a vertical channel list) on the left, a flexible stream area in the middle with a live/title/category/viewer-count header, and a fixed ~380px chat panel on the right.
- Chat rows in Twitch Style now flow inline like real Twitch chat (timestamp, colored username, message text on one wrapping line) instead of stacked multi-column rows.
- Channel tabs are slimmer with a subtler active state, the chat header (channel/users/connection/logs) is sticky, and the Wave/Say hello/Leave channel action row sits directly under the video instead of floating disconnected from it.
- Added a responsive breakpoint: narrow windows collapse the sidebar to icons-only while chat stays fixed-width and the stream shrinks but keeps its 16:9 shape.
- This redesign only affects Twitch Style; the Standard layout is unchanged.

## Sidebar & Chat Proportions

- Condensed the sidebar from 336px to 290px and tightened workspace button sizing (height, font size, padding) so labels fit cleanly without crowding.
- Capped the docked stream player's height so its embed/overlay content can't balloon and push the rest of the sidebar out of proportion.
- Tightened the fixed timestamp and username columns in chat rows, giving message text more horizontal room across all layouts.

## Twitch Style Layout Polish

- Widened the chat column relative to the stream in Twitch Style layout so message text has more breathing room instead of being squeezed into a narrow strip.
- The left sidebar is now thinner specifically in Twitch Style layout, freeing up more space for the stream and chat.

## Layouts: Standard & Twitch Style

- Added a Layouts section in Settings with two options.
- Standard keeps the existing layout: chat and user list side by side, stream player in the sidebar (dockable/floatable as before).
- Twitch Style places the stream inline in the middle of the chat view with chat on the right, and tucks the user list behind a toggle icon instead of an always-visible column.

## Emote Picker

- Added an emote button next to the message box that opens a searchable picker with Twitch and 7TV tabs.
- Emotes are grouped by streamer (channel), covering every channel you've joined, not just the active one; the Twitch tab also has a separate Global section.
- Twitch emotes are fetched from Helix (global emotes plus each channel's emote set) reusing the existing Twitch token/client-id; 7TV emotes reuse the per-channel set already loaded for chat rendering.
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
