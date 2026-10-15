[![Be API Github Banner](.github/banner-github.png)](https://beapi.fr)

[![Test with WordPress Playground](https://img.shields.io/badge/Test%20with-WordPress%20Playground-0073aa?style=for-the-badge&logo=wordpress&logoColor=white)](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/BeAPI/blockparty-button-icon/refs/heads/main/.wordpress-org/blueprints/blueprint.json)

# Blockparty Button Icon

Extend the WordPress **core Button** block (`core/button`) with optional icons, placement controls, and spacing between icon and label.

## Features

- **Core block extension**: No new block name — editors keep using the familiar Button block
- **Optional icon**: Insert an icon as an inner block (defaults to `core/icon` on WordPress 7.0+)
- **Icon position**: Display the icon to the left or right of the label
- **Block gap**: Control horizontal spacing between icon and text via block spacing settings
- **Valid markup**: Icons render inside links with a `span` wrapper on the front end (phrasing content)
- **Extensible**: Filter which icon block types may be inserted into a button

## Requirements

- WordPress 7.0 or higher
- PHP 8.1 or higher
- Gutenberg block editor

## Installation

### Manual installation

1. Download the plugin files
2. Upload the `blockparty-button-icon` folder to `/wp-content/plugins/`
3. Activate the plugin through the **Plugins** screen in WordPress

### Composer installation

```bash
composer require beapi/blockparty-button-icon
```

## Usage

### Enable an icon on a button

1. Add or select a **Button** block in the editor
2. Open the block **Styles** panel (sidebar)
3. Turn on **Show icon**
4. Choose **Left** or **Right** for icon position
5. Use the block toolbar **Icon** control to pick or replace the icon
6. Adjust **Block spacing → Block gap** (horizontal) to change the space between icon and label

### Allowed icon blocks

By default, only `core/icon` is allowed inside the button link.

Customize the list with the `blockparty_button_icon_allowed_icon_blocks` filter:

```php
add_filter(
	'blockparty_button_icon_allowed_icon_blocks',
	static function (): array {
		return array( 'core/icon', 'blockparty/icon' );
	}
);
```

The first block type in the filtered list is used when the editor creates a new icon inner block.

## Accessibility

- Button label text is wrapped in `<span class="wp-block-button__label">` when an icon is present, keeping a clear text node for assistive technologies
- On the front end, `core/icon` outer wrappers are output as `span` elements when rendered inside button links

## Generated markup example

```html
<div class="wp-block-button blockparty-button-icon blockparty-button-icon--left">
	<a class="wp-block-button__link wp-element-button" href="#" style="gap:var(--wp--preset--spacing--20)">
		<span class="wp-block-icon" aria-hidden="true">…</span>
		<span class="wp-block-button__label">Get started</span>
	</a>
</div>
```

## Development

### Prerequisites

- Node.js 24.18+ and npm 11.16+ (see `package.json` `engines`)
- Composer 2.x

### Build

```bash
composer install
npm install
npm run build
```

### Watch mode

```bash
npm start
```

### Linting

```bash
composer cs
npm run lint:js src
npm run lint:css -- "src/**/*.scss"
```

### WordPress Playground blueprint

The [Playground blueprint](.wordpress-org/blueprints/blueprint.json) installs the plugin from the `playground/blueprint-preview` branch, which includes built assets and Composer `vendor/` for demos. Update that branch after releases when you change the public demo.

### Internationalization

```bash
npm run make-pot
npm run make-json
```

## Support

For bug reports and feature requests, use the [GitHub issues](https://github.com/BeAPI/blockparty-button-icon/issues) page.

## Changelog

See [readme.txt](readme.txt) and [CHANGELOG.md](CHANGELOG.md) for version history.

Developed with ❤️ by [Be API](https://beapi.fr)

## License

GPL-2.0-or-later
