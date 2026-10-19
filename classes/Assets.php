<?php
/**
 * Script and style registration.
 *
 * @package Blockparty\ButtonIcon
 */

namespace Blockparty\ButtonIcon;

/**
 * Enqueues editor and front-end assets.
 */
class Assets {

	/**
	 * Singleton instance.
	 *
	 * @var self|null
	 */
	private static $instance = null;

	/**
	 * Returns the singleton instance.
	 *
	 * @return self
	 */
	public static function get_instance(): self {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Registers asset hooks.
	 */
	private function __construct() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_assets' ) );
		add_action( 'enqueue_block_assets', array( $this, 'enqueue_block_assets' ) );
	}

	/**
	 * Enqueue editor script that extends core/button.
	 */
	public function enqueue_editor_assets(): void {
		$script_path = BLOCKPARTY_BUTTON_ICON_DIR . 'build/index.js';

		if ( ! is_readable( $script_path ) ) {
			return;
		}

		$asset_file = BLOCKPARTY_BUTTON_ICON_DIR . 'build/index.asset.php';
		$asset      = is_readable( $asset_file )
			? include $asset_file
			: array(
				'dependencies' => array(),
				'version'      => BLOCKPARTY_BUTTON_ICON_VERSION,
			);

		$style_path = BLOCKPARTY_BUTTON_ICON_DIR . 'build/index.css';

		wp_enqueue_script(
			'blockparty-button-icon-editor',
			BLOCKPARTY_BUTTON_ICON_URL . 'build/index.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		if ( is_readable( $style_path ) ) {
			wp_enqueue_style(
				'blockparty-button-icon-editor',
				BLOCKPARTY_BUTTON_ICON_URL . 'build/index.css',
				array(),
				$asset['version']
			);
		}

		wp_localize_script(
			'blockparty-button-icon-editor',
			'blockpartyButtonIconSettings',
			array(
				'allowedIconBlocks' => AllowedIconBlocks::get(),
			)
		);

		wp_set_script_translations(
			'blockparty-button-icon-editor',
			'blockparty-button-icon',
			BLOCKPARTY_BUTTON_ICON_DIR . 'languages'
		);
	}

	/**
	 * Enqueue front-end and editor styles for button + icon layout.
	 */
	public function enqueue_block_assets(): void {
		$style_path = BLOCKPARTY_BUTTON_ICON_DIR . 'build/style-index.css';

		if ( ! is_readable( $style_path ) ) {
			return;
		}

		$asset_file = BLOCKPARTY_BUTTON_ICON_DIR . 'build/style-index.asset.php';
		$asset      = is_readable( $asset_file )
			? include $asset_file
			: array(
				'dependencies' => array(),
				'version'      => BLOCKPARTY_BUTTON_ICON_VERSION,
			);

		wp_enqueue_style(
			'blockparty-button-icon',
			BLOCKPARTY_BUTTON_ICON_URL . 'build/style-index.css',
			$asset['dependencies'],
			$asset['version']
		);
	}
}
