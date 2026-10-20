<?php
/**
 * Tests for allowed icon blocks helper.
 *
 * @package Blockparty\ButtonIcon
 */

namespace Blockparty\ButtonIcon\Tests;

use Blockparty\ButtonIcon\AllowedIconBlocks;
use WP_UnitTestCase;

/**
 * @covers \Blockparty\ButtonIcon\AllowedIconBlocks
 */
class AllowedIconBlocksTest extends WP_UnitTestCase {

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
	public function test_defaults_to_core_icon(): void {
		$this->assertSame( array( 'core/icon' ), AllowedIconBlocks::get() );
	}

	/**
	 * @return void
	 */
	public function test_filter_can_replace_icon_blocks(): void {
		add_filter(
			'blockparty_button_icon_allowed_icon_blocks',
			static function (): array {
				return array( 'blockparty/icon' );
			}
		);

		$this->assertSame(
			array( 'blockparty/icon' ),
			AllowedIconBlocks::get()
		);
	}

	/**
	 * @return void
	 */
	public function test_filter_can_append_icon_blocks(): void {
		add_filter(
			'blockparty_button_icon_allowed_icon_blocks',
			static function ( array $blocks ): array {
				$blocks[] = 'my-plugin/custom-icon';
				return $blocks;
			}
		);

		$this->assertSame(
			array(
				'core/icon',
				'my-plugin/custom-icon',
			),
			AllowedIconBlocks::get()
		);
	}

	/**
	 * @return void
	 */
	public function test_non_string_values_are_stripped_and_duplicates_removed(): void {
		add_filter(
			'blockparty_button_icon_allowed_icon_blocks',
			static function (): array {
				return array(
					'core/icon',
					'',
					123,
					'core/icon',
					'beapi/icon-block',
				);
			}
		);

		$this->assertSame(
			array(
				'core/icon',
				'beapi/icon-block',
			),
			AllowedIconBlocks::get()
		);
	}

	/**
	 * @return void
	 */
	public function test_non_array_filter_result_falls_back_to_default(): void {
		add_filter(
			'blockparty_button_icon_allowed_icon_blocks',
			static function () {
				return 'core/icon';
			}
		);

		$this->assertSame( array( 'core/icon' ), AllowedIconBlocks::get() );
	}

	/**
	 * @return void
	 */
	public function test_empty_sanitized_list_returns_empty_array(): void {
		add_filter(
			'blockparty_button_icon_allowed_icon_blocks',
			static function (): array {
				return array( '', 42 );
			}
		);

		$this->assertSame( array(), AllowedIconBlocks::get() );
	}
}
