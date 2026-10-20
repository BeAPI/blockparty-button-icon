<?php
/**
 * Tests for front-end icon wrapper conversion inside buttons.
 *
 * @package Blockparty\ButtonIcon
 */

namespace Blockparty\ButtonIcon\Tests;

use Blockparty\ButtonIcon\IconBlockRenderer;
use WP_UnitTestCase;

/**
 * @covers \Blockparty\ButtonIcon\IconBlockRenderer
 */
class IconBlockRendererTest extends WP_UnitTestCase {

	/**
	 * Reset nesting depth left by unbalanced helper calls.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		$renderer = IconBlockRenderer::get_instance();
		$property = new \ReflectionProperty( IconBlockRenderer::class, 'button_with_icon_depth' );
		$property->setAccessible( true );
		$property->setValue( $renderer, 0 );
		parent::tearDown();
	}

	/**
	 * @return void
	 */
	public function test_convert_icon_wrapper_to_span_replaces_outer_div(): void {
		$html = '<div class="wp-block-icon"><svg viewBox="0 0 24 24"></svg></div>';

		$result = IconBlockRenderer::convert_icon_wrapper_to_span( $html );

		$this->assertSame(
			'<span class="wp-block-icon"><svg viewBox="0 0 24 24"></svg></span>',
			$result
		);
	}

	/**
	 * @return void
	 */
	public function test_convert_icon_wrapper_to_span_is_noop_without_icon_class(): void {
		$html = '<div class="other"><svg></svg></div>';

		$this->assertSame(
			$html,
			IconBlockRenderer::convert_icon_wrapper_to_span( $html )
		);
	}

	/**
	 * @return void
	 */
	public function test_render_icon_as_span_converts_only_inside_button_with_icon(): void {
		$renderer = IconBlockRenderer::get_instance();
		$html     = '<div class="wp-block-icon has-icon"><svg></svg></div>';
		$icon     = array( 'blockName' => 'core/icon' );

		$this->assertSame(
			$html,
			$renderer->render_icon_as_span( $html, $icon ),
			'Without button-with-icon context, markup stays unchanged.'
		);

		$renderer->enter_button_with_icon_context(
			null,
			array(
				'blockName' => 'core/button',
				'attrs'     => array( 'hasIcon' => true ),
			)
		);

		$converted = $renderer->render_icon_as_span( $html, $icon );
		$this->assertSame(
			'<span class="wp-block-icon has-icon"><svg></svg></span>',
			$converted
		);

		$renderer->leave_button_with_icon_context(
			'',
			array(
				'blockName' => 'core/button',
				'attrs'     => array( 'hasIcon' => true ),
			)
		);

		$this->assertSame(
			$html,
			$renderer->render_icon_as_span( $html, $icon ),
			'After leaving context, markup stays unchanged again.'
		);
	}

	/**
	 * @return void
	 */
	public function test_enter_button_with_icon_context_respects_pre_render_short_circuit(): void {
		$renderer = IconBlockRenderer::get_instance();

		$result = $renderer->enter_button_with_icon_context(
			'<p>short-circuit</p>',
			array(
				'blockName' => 'core/button',
				'attrs'     => array( 'hasIcon' => true ),
			)
		);

		$this->assertSame( '<p>short-circuit</p>', $result );
		$this->assertSame(
			'<div class="wp-block-icon"></div>',
			$renderer->render_icon_as_span(
				'<div class="wp-block-icon"></div>',
				array( 'blockName' => 'core/icon' )
			),
			'Short-circuited pre_render must not enter button-with-icon context.'
		);
	}

	/**
	 * @return void
	 */
	public function test_render_block_filters_convert_icon_inside_button_with_icon(): void {
		$button    = array(
			'blockName' => 'core/button',
			'attrs'     => array( 'hasIcon' => true ),
		);
		$icon_html = '<div class="wp-block-icon"><svg></svg></div>';
		$icon      = array(
			'blockName' => 'core/icon',
			'attrs'     => array(),
		);

		apply_filters( 'pre_render_block', null, $button );

		// phpcs:ignore WordPress.NamingConventions.ValidHookName.UseUnderscores -- Core block filter name.
		$result = apply_filters( 'render_block_core/icon', $icon_html, $icon );

		// phpcs:ignore WordPress.NamingConventions.ValidHookName.UseUnderscores -- Core block filter name.
		apply_filters( 'render_block_core/button', '<a class="wp-block-button__link"></a>', $button );

		$this->assertSame(
			'<span class="wp-block-icon"><svg></svg></span>',
			$result
		);
	}
}
