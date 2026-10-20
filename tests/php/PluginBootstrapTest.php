<?php
/**
 * Tests for plugin bootstrap constants and hooks.
 *
 * @package Blockparty\ButtonIcon
 */

namespace Blockparty\ButtonIcon\Tests;

use Blockparty\ButtonIcon\Assets;
use Blockparty\ButtonIcon\IconBlockRenderer;
use Blockparty\ButtonIcon\Main;
use WP_UnitTestCase;

/**
 * @covers \Blockparty\ButtonIcon\Main
 * @covers \Blockparty\ButtonIcon\init_blockparty_button_icon_plugin
 */
class PluginBootstrapTest extends WP_UnitTestCase {

	/**
	 * @return void
	 */
	public function test_plugin_constants_are_defined(): void {
		$this->assertTrue( defined( 'BLOCKPARTY_BUTTON_ICON_VERSION' ) );
		$this->assertTrue( defined( 'BLOCKPARTY_BUTTON_ICON_DIR' ) );
		$this->assertTrue( defined( 'BLOCKPARTY_BUTTON_ICON_URL' ) );
		$this->assertTrue( defined( 'BLOCKPARTY_BUTTON_ICON_PLUGIN_BASENAME' ) );
		$this->assertNotEmpty( BLOCKPARTY_BUTTON_ICON_VERSION );
	}

	/**
	 * @return void
	 */
	public function test_init_callback_is_registered_on_plugins_loaded(): void {
		$this->assertNotFalse(
			has_action(
				'plugins_loaded',
				'Blockparty\\ButtonIcon\\init_blockparty_button_icon_plugin'
			)
		);
	}

	/**
	 * @return void
	 */
	public function test_singletons_are_bootstrapped(): void {
		$this->assertInstanceOf( Main::class, Main::get_instance() );
		$this->assertInstanceOf( Assets::class, Assets::get_instance() );
		$this->assertInstanceOf(
			IconBlockRenderer::class,
			IconBlockRenderer::get_instance()
		);
	}

	/**
	 * @return void
	 */
	public function test_asset_hooks_are_registered(): void {
		$assets = Assets::get_instance();

		$this->assertNotFalse(
			has_action( 'enqueue_block_editor_assets', array( $assets, 'enqueue_editor_assets' ) )
		);
		$this->assertNotFalse(
			has_action( 'enqueue_block_assets', array( $assets, 'enqueue_block_assets' ) )
		);
	}

	/**
	 * @return void
	 */
	public function test_icon_renderer_hooks_are_registered(): void {
		$renderer = IconBlockRenderer::get_instance();

		$this->assertNotFalse(
			has_filter( 'pre_render_block', array( $renderer, 'enter_button_with_icon_context' ) )
		);
		$this->assertNotFalse(
			has_filter( 'render_block_core/button', array( $renderer, 'leave_button_with_icon_context' ) )
		);
		$this->assertNotFalse(
			has_filter( 'render_block_core/icon', array( $renderer, 'render_icon_as_span' ) )
		);
	}
}
