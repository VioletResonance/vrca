# VRChat Offline Avatar Library

A lightweight, offline-first avatar library for VRChat users — designed as a personal, editable HTML archive.

This tool allows you to save and manage your favorite VRChat avatars locally, including full card previews, tags, and CRUD operations. All functionality is implemented client-side with no backend.

---

## 📁 Project Structure

```
/
├── .editorconfig
├── .gitignore
├── eslint.config.js
├── LICENSE.md
├── package-lock.json
├── package.json
├── README.md
├── vite.config.js
├── dist/
│   └── avatars.html
├── src/
│   ├── index.css
│   ├── index.html
│   ├── index.js
│   ├── scripts/
│   │   ├── App.js
│   │   ├── config/
│   │   │   ├── Config.js
│   │   │   └── UIMap.js
│   │   ├── core/
│   │   │   ├── EventBus.js
│   │   ├── modules/
│   │   │   ├── Avatar/
│   │   │   │   ├── AvatarManager.js
│   │   │   │   ├── AvatarBuilder.js
│   │   │   │   └── AvatarData.js
│   │   │   ├── Avatars/
│   │   │   │   ├── AvatarsManager.js
│   │   │   │   └── AvatarsBuilder.js
│   │   │   ├── Dialog/
│   │   │   │   └── DialogManager.js
│   │   │   ├── Dropdown/
│   │   │   │   └── DropdownManager.js
│   │   │   ├── Export/
│   │   │   │   └── ExportManager.js
│   │   │   ├── Filter/
│   │   │   │   └── FilterManager.js
│   │   │   ├── Form/
│   │   │   │   └── FormManager.js
│   │   │   ├── Header/
│   │   │   │   └── HeaderManager.js
│   │   │   ├── Import/
│   │   │   │   └── ImportManager.js
│   │   │   ├── Modal/
│   │   │   │   └── ModalManager.js
│   │   │   └── Unload/
│   │   │       └──UnloadManager.js
│   │   └── utils/
│   │       └── Utils.js
│   └── styles/
│       ├── app.css
│       ├── base/
│       │   ├── base.css
│       │   └── reset.css
│       └── modules/
│           ├── avatar.css
│           ├── avatars.css
│           ├── dialog.css
│           ├── filter.css
│           ├── form.css
│           └── modal.css
├── tools/
│   ├── avatars.ps1
│   └── avatars.sh
└── vite/
    └── plugins/
        ├── vite-plugin-move-scripts/
        │   └── index.js
        ├── vite-plugin-rename-files/
        │   └── index.js
        └── vite-plugin-strip-html-comments/
            └── index.js
```

---

## ✨ Features

- Import avatar cards from [vrcdb.com](https://vrcdb.com)
- Offline storage — single `avatars.html` file with all logic and layout
- Grouped display with filter tags and platforms (PC / Android / iOS Optimized) features (GoGoLoco, Fly Mode, Seat Place, Marker, VRCFT, NSFW) indicators
- CRUD operations: Add, Edit, Delete avatars
- Reorder and reorganize layout in "Edit layout" mode: move avatars, Add, Edit, Delete groups
- Export avatar library to JSON format  (`Export JSON` button) and import it back (`Import JSON` button)
- Export to static HTML (`Save as HTML` button)
- Shell script to download and embed avatar thumbnails locally
- Simple HTML/CSS/JS stack — no frameworks or builds required to run output
- Compatible with modern browsers
- **Warns the user if there are unsaved changes when trying to leave or refresh the page**: prevents accidental data loss by prompting the user before they navigate away from the page.

---

## 🔧 How to Use

1. Open [vrcdb.com](https://vrcdb.com)
2. Find an avatar you like
3. In your browser dev tools, copy the `<div class="avatar-card">` block from the page
4. In your offline library (`avatars.html`), click **Add Avatar**, paste the block, and fill out the details
5. Confirm to save the avatar in the current group
6. Use **Edit Layout** to reorder avatars and manage groups
7. Press **Save as HTML** to save your collection
8. Import or Export your avatar collection:
    - Export: Press **Export JSON** to save your library in JSON format for easier transfer or backup.
    - Import: Press **Import JSON** to load previously saved collections and restore them into the library.
9. Run [avatars.ps1](/tools/avatars.ps1) or [avatars.sh](/tools/avatars.sh) to download local copies of avatar images.

**Be aware**: If you have unsaved changes, you will be warned when trying to leave or refresh the page.

Example HTML from VRCDB:

```html
<div class="avatar-card">
  <div class="avatar-inner">
    <div class="avatar-image-wrap">
      <a href="/go/vrchat/a298FLiMRdJxtHORRZcrecpHl15goXtcpadmLdtSv9xcwbNi1tRc2l6WiUYWUNBHXPATeUY2euNOYGqGdMBdrEq3gEnWZ6">
        <img src="/img/avatar?token=a298FLiMRdJxtHORRZcrecpHl15goXtcpadmLdtSv9xcwbNi1tRc2l6WiUYWUNBHXPATeUY2euNOYGqGdMBdrEq3gEnWZ6">
      </a>
    </div>
    <div class="card-content">
      <h2 class="avatar-name">vrcfox</h2>
      <p class="author-name">By trev3d</p>
      <p class="description">a minimalistic furry avatar</p>
    </div>
  </div>
</div>
```

---

## 🛠️ Build Instructions

```sh
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Run preview server
npm run preview
```

- Vite plugins:
  - `vite-plugin-eslint` — Checks scripts and styles
  - `vite-plugin-singlefile` — Inlines scripts and styles
  - `autoprefixer` - Adds css prefixes for better browser compatibility
  - `postcss-sort-media-queries` - Sorts and moves css media queries to the end of the css bundle
- Custom plugins:
  - `vite-plugin-move-scripts` — Moves inlined javascript bundle from <head> to <body>
  - `vite-plugin-rename-files` — Renames `index.html` to `avatars.html` to preserve export naming convention
  - `vite-plugin-strip-html-comments` — Removes comments from `index.html`

---

## ⚙️ Service Script

This project provides script to resolve avatar links, download avatar thumbnails, replace remote URLs with local paths in `avatars.html`. The script:

- Scans `avatars.html` for avatar tokens
- Resolves redirect URL to avatar link and avatar image link
- Downloads each image into the `/images` folder
- Replaces redirect URLs with avatar links and image local paths

Choose the one matching your platform:

1️⃣ PowerShell (Windows)

Located in [/tools/avatars.ps1](/tools/avatars.ps1)

Make sure PowerShell allows script execution. You may need to run as Administrator and set:

```pwsh
Set-ExecutionPolicy RemoteSigned
Set-ExecutionPolicy Unrestricted
```

Run the script from the folder containing `avatars.html`:

```pwsh
.\avatars.ps1`
```

2️⃣ Bash / Shell (Linux/macOS)

Located in [/tools/avatars.sh](/tools/avatars.sh)

Run the script from the folder containing `avatars.html`:

```sh
chmod +x avatars.sh
./avatars.sh
```

Example output:

```sh
[~] Searching for avatar tokens...
[!] Avatar tokens not found
[+] Avatar token: ...
[+] Avatar ID: ...
[=] Image already exists
[~] Downloading image...
[~] Updating links...
[v] HTML updated: avatars.html
```

---

## 🔗 Dependencies

**No frameworks — pure JS modules and CSS**

#### Vendor Libraries
- [dompurify](https://github.com/cure53/DOMPurify) — for sanitizing HTML
- [js-beautify](https://github.com/beautifier/js-beautify) — for beautifying code
- [sortablejs](https://github.com/SortableJS/Sortable) — for drag-and-drop sortable lists

#### Developer Tool
- [Vite](https://vitejs.dev/) for bundling
- [vite-plugin-eslint](https://github.com/gxmari007/vite-plugin-eslint) - for linting js and css
- [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile) — for single-file output
- [autoprefixer](https://github.com/postcss/autoprefixer) — for automatic CSS vendor prefixing
- [postcss-sort-media-queries](https://github.com/yunusga/postcss-sort-media-queries) — for sorting media queries in CSS

---

## 💻 Code Style and Linting

This project uses ESLint with a strict code style configuration for JavaScript and CSS. The linter automatically checks the code style, enforcing rules like single quotes, 2-space indentation, and mandatory JSDoc documentation.
We recommend setting up your editor with ESLint support for automatic linting as you work.

#### Configuration Files
- [ESLint Configuration](eslint.config.js)
- [EditorConfig](.editorconfig)


## ✅ TODO / Ideas

#### Workflow
- Add tests

#### Refactoring
- Support SASS/SCSS : variables, nested selectors and media queries
- Support TypeScript: types, interfaces, and strong typing

#### Features
- Advanced Add/Edit avatar form: switch between raw code textarea and name, author, description, link, image url fields
- Avatar add date (auto or custom) + sorting or filter by date
- Custom themes, switch dark/light
- Internationalization

---

## 📌 Notes

- This project is not affiliated with `vrchat`, `vrcdb` or `avtrdb`
- Be mindful of VRChat content rules and licensing when saving avatars

---

## ⚖️ Legal Disclaimer

VRCA (VRChat Offline Avatar Library) is not affiliated with VRChat and does not represent the views or opinions of VRChat or anyone officially associated with the development or management of VRChat properties.

This tool is intended for personal, offline use only and does not intend to infringe upon any intellectual property or rights held by VRChat Inc. or any third parties. All rights to avatars, content, and trademarks related to VRChat and third-party assets remain the property of their respective owners.

VRChat and all related trademarks are the property of VRChat Inc.

---

## 📄 License

MIT — free to use, modify and share ([LICENSE.md](LICENSE.md)).

## Made with&nbsp;&nbsp;💜&nbsp;&nbsp;by&nbsp;&nbsp;🤖&nbsp;&nbsp;😸&nbsp;&nbsp;🧁&nbsp;&nbsp;🐱&nbsp;&nbsp;and&nbsp;&nbsp;🟣
