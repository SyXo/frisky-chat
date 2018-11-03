# frisky-chat

## what is frisky-chat?

it's an image gallery that is fully decentralized, p2p solution to collecting and sharing porn of various kinds.

## why just porn?

this is for sex-positive folks who want to explore their sexuality. it helps by having [specific tags](docs/tags.md).

## it's fully decentralized? how is it secure?

files are hashed to prevent tampering. tag data is signed and attributed to a user.

user contributions can be whitelisted and blacklisted.

images are limited to 2K x 2K pixels. if a patreon is distributing higher resolution images, these will be scaled down, and into webp format, to lower storage and bandwidth requirements.

## implemented features

- [x] electron app
- [ ] distributed database
- [x] pool view
  - [x] keyboard selection
  - [x] mouse selection
  - [x] infinite scroll
- [x] fullscreen view
- [x] pool upload
  - [x] phash
  - [x] strip metadata
  - [x] add hash to db
  - [x] local `indexed.db`
  - [ ] remove local image
  - [ ] drag and drop
- [ ] tagging
  - [ ] add tag
  - [ ] tag channels
  - [ ] tag count
- [ ] collections
  - [ ] albums
  - [ ] fave tags
  - [ ] sorting
    - [ ] index (if available)
    - [ ] a-z local filename
    - [ ] local date
    - [ ] date added
    - [ ] year
- [ ] users
  - [ ] registration
  - [ ] login
  - [ ] friends
  - [ ] ban subscriptions
    - [ ] image by sha
    - [ ] data by user/signature
- [ ] leaderboard
  - [ ] most friends (lots of people trust these users)
  - [ ] most tags
  - [ ] most images shared
  - [ ] most bandwidth shared
- [ ] chat
  - [ ] per-post
- [ ] explore
  - [ ] fave
  - [ ] prefs
- [ ] ui
  - [x] icons
  - [ ] tooltips
  - [ ] modals
    - [ ] nav keys
    - [ ] help
- [ ] p2p image streaming
  - [ ] investigate bittorrent (instead of webrtc direct connection)
  - [ ] webrtc turn/stun server
  - [ ] save images
- [ ] security
  - [ ] verify sha
  - [ ] assert image magic number
- [ ] infrastructure
  - [ ] tracker
    - [ ] sha blacklisting
    - [ ] backup
  - [ ] ci/cd
    - [ ] linter
    - [ ] tests
    - [ ] builds
