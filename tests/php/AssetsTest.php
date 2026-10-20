<?php
/**
 * Tests for editor and front-end asset enqueue.
 *
 * @package Blockparty\ButtonIcon
 */

namespace Blockparty\ButtonIcon\Tests;

use Blockparty\ButtonIcon\Assets;
use WP_UnitTestCase;

/**
 * @covers \Blockparty\ButtonIcon\Assets
 */
class AssetsTest extends WP_UnitTestCase {

	/**
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		// phpcs:disable WordPress.WP.GlobalVariablesOverride.Prohibited -- Reset script/style registries between tests.
		wp_scripts()->registered = array();
		wp_scripts()->queue      = array();
		wp_scripts()->done       = array();
		wp_styles()->registered  = array();
		wp_styles()->queue       = array();
		wp_styles()->done        = array();
		// phpcs:enable WordPress.WP.GlobalVariablesOverride.Prohibited
	}

	/**
	 * @return void
	 */
	public function tearDown(): void {
		remove_all_filters( 'blockparty_button_icon_allowed_icon_blocks' );
		parent::tearDown();
	}

	/**
	 * @return void
	 */
	public function test_enqueue_editor_assets_localizes_allowed_icon_blocks(): void {
		$script = BLOCKPARTY_BUTTON_ICON_DIR . 'build/index.js';
		if ( ! is_readable( $script ) ) {
			$this->markTestSkipped( 'Built editor asset missing; run npm run build.' );
		}

		Assets::get_instance()->enqueue_editor_assets();

		$this->assertTrue( wp_script_is( 'blockparty-button-icon-editor', 'enqueued' ) );

		$localized = wp_scripts()->get_data( 'blockparty-button-icon-editor', 'data' );
		$this->assertIsString( $localized );
		$this->assertStringContainsString( 'blockpartyButtonIconSettings', $localized );
		$this->assertStringContainsString( 'allowedIconBlocks', $localized );
		$this->assertMatchesRegularExpression( '/core\\\\?\/icon/', $localized );
	}

	/**
	 * @return void
	 */
	public function test_enqueue_editor_assets_is_noop_without_built_script(): void {
		$script = BLOCKPARTY_BUTTON_ICON_DIR . 'build/index.js';
		if ( is_readable( $script ) ) {
			$this->markTestSkipped( 'Built editor asset is present; noop path cannot be asserted.' );
		}

		Assets::get_instance()->enqueue_editor_assets();

		$this->assertFalse( wp_script_is( 'blockparty-button-icon-editor', 'enqueued' ) );
	}

	/**
	 * @return void
	 */
	public function test_enqueue_block_assets_registers_front_style_when_built(): void {
		$style = BLOCKPARTY_BUTTON_ICON_DIR . 'build/style-index.css';
		if ( ! is_readable( $style ) ) {
			$this->markTestSkipped( 'Built front style missing; run npm run build.' );
		}

		Assets::get_instance()->enqueue_block_assets();

		$this->assertTrue( wp_style_is( 'blockparty-button-icon', 'enqueued' ) );
	}
}
