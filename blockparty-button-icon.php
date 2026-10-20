<?php
/**
 * Plugin Name:       Blockparty Button Icon
 * Description:       Easily add icons to button blocks in WordPress.
 * Version:           1.0.0
 * Requires at least: 7.0
 * Requires PHP:      8.1
 * Author:            Be API Technical Team
 * Author URI:        https://beapi.fr
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       blockparty-button-icon
 * Domain Path:       /languages
 *
 * @package Blockparty\ButtonIcon
 */

namespace Blockparty\ButtonIcon;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! is_readable( __DIR__ . '/vendor/autoload.php' ) ) {
	return;
}

require_once __DIR__ . '/vendor/autoload.php';

define( 'BLOCKPARTY_BUTTON_ICON_VERSION', '1.0.0' );
define( 'BLOCKPARTY_BUTTON_ICON_URL', plugin_dir_url( __FILE__ ) );
define( 'BLOCKPARTY_BUTTON_ICON_DIR', plugin_dir_path( __FILE__ ) );
define( 'BLOCKPARTY_BUTTON_ICON_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

add_action( 'plugins_loaded', __NAMESPACE__ . '\\init_blockparty_button_icon_plugin' );

/**
 * Init the plugin.
 */
function init_blockparty_button_icon_plugin(): void {
	Main::get_instance();
	Assets::get_instance();
	IconBlockRenderer::get_instance();
}
