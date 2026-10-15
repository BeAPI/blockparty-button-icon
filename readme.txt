=== Blockparty Button Icon ===
Contributors:      beapi
Tags:              block, button, icon, gutenberg
Requires at least: 7.0
Tested up to:      7.0
Requires PHP:      8.1
Stable tag:        1.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Extend the core Button block with optional icons and layout controls in the block editor.

== Description ==

Blockparty Button Icon enhances the WordPress core Button block (`core/button`) so editors can add an icon (for example `core/icon`) next to the label, choose left or right placement, and control spacing between icon and text via block gap.

= Features =

* Extends the core Button block (no new block name)
* Optional icon via inner blocks (defaults to `core/icon`)
* Icon position: left or right
* Horizontal block gap for icon ↔ label spacing
* Valid HTML inside links (`span` wrapper for icons on the front end)
* Filter `blockparty_button_icon_allowed_icon_blocks` to allow other icon block types

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/blockparty-button-icon` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Edit a Button block in the block editor and enable the icon options under block styles.

== Frequently Asked Questions ==

= Which icon blocks are supported? =

By default, only `core/icon` is allowed inside the button. Use the `blockparty_button_icon_allowed_icon_blocks` filter to register additional block types.

== Changelog ==

= 1.0.0 =
* Initial release
