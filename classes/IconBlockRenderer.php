<?php
/**
 * Front-end rendering adjustments for icons inside buttons.
 *
 * @package Blockparty\ButtonIcon
 */

namespace Blockparty\ButtonIcon;

/**
 * Converts core/icon wrappers so markup stays valid inside button links.
 */
class IconBlockRenderer {

	/**
	 * Singleton instance.
	 *
	 * @var self|null
	 */
	private static $instance = null;

	/**
	 * Nesting depth of core/button blocks currently rendering with hasIcon.
	 *
	 * @var int
	 */
	private $button_with_icon_depth = 0;

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
	 * Registers the render block filters.
	 */
	private function __construct() {
		// Run last so a non-null pre_render short-circuit is visible before we enter context.
		add_filter( 'pre_render_block', array( $this, 'enter_button_with_icon_context' ), PHP_INT_MAX, 2 );
		add_filter( 'render_block_core/button', array( $this, 'leave_button_with_icon_context' ), 10, 2 );
		add_filter( 'render_block_core/icon', array( $this, 'render_icon_as_span' ), 10, 2 );
	}

	/**
	 * Enters context when a core/button with hasIcon is about to render.
	 *
	 * @param string|null $pre_render   Pre-rendered content, or null to continue.
	 * @param array       $parsed_block Parsed block data.
	 * @return string|null Unchanged pre-render value.
	 */
	public function enter_button_with_icon_context( $pre_render, array $parsed_block ) {
		if ( null !== $pre_render ) {
			return $pre_render;
		}

		if ( $this->is_button_with_icon( $parsed_block ) ) {
			++$this->button_with_icon_depth;
		}

		return $pre_render;
	}

	/**
	 * Leaves context after a core/button with hasIcon has finished rendering.
	 *
	 * @param string $block_content Rendered block HTML.
	 * @param array  $block         Block data.
	 * @return string Unchanged HTML.
	 */
	public function leave_button_with_icon_context( string $block_content, array $block ): string {
		if ( $this->is_button_with_icon( $block ) && $this->button_with_icon_depth > 0 ) {
			--$this->button_with_icon_depth;
		}

		return $block_content;
	}

	/**
	 * Renders core/icon with a span wrapper when used inside button links (valid phrasing content).
	 *
	 * Only convert when nested in a core/button with hasIcon. The editor keeps the
	 * React-owned div wrapper; conversion is front-end only.
	 *
	 * @param string $block_content Rendered block HTML.
	 * @param array  $block         Block data.
	 * @return string Filtered HTML.
	 */
	public function render_icon_as_span( string $block_content, array $block ): string {
		if (
			'core/icon' !== ( $block['blockName'] ?? '' )
			|| '' === $block_content
			|| $this->button_with_icon_depth < 1
		) {
			return $block_content;
		}

		return self::convert_icon_wrapper_to_span( $block_content );
	}

	/**
	 * Whether the parsed block is a core/button with icon support enabled.
	 *
	 * @param array $block Parsed block data.
	 * @return bool True when the block is an icon-enabled button.
	 */
	private function is_button_with_icon( array $block ): bool {
		return 'core/button' === ( $block['blockName'] ?? '' )
			&& ! empty( $block['attrs']['hasIcon'] );
	}

	/**
	 * Converts the outer core/icon wrapper from div to span.
	 *
	 * @param string $html Rendered icon block HTML.
	 * @return string HTML with a span wrapper when applicable.
	 */
	public static function convert_icon_wrapper_to_span( string $html ): string {
		if ( false === stripos( $html, 'wp-block-icon' ) ) {
			return $html;
		}

		$with_open_tag = preg_replace(
			'/<div(\s[^>]*\bclass="[^"]*\bwp-block-icon\b[^"]*"[^>]*)>/i',
			'<span$1>',
			$html,
			1,
			$open_replacements
		);

		if ( null === $with_open_tag || 0 === $open_replacements ) {
			return $html;
		}

		$with_close_tag = preg_replace( '/<\/div>\s*$/i', '</span>', $with_open_tag, 1, $close_replacements );

		if ( null === $with_close_tag || 0 === $close_replacements ) {
			return $html;
		}

		return $with_close_tag;
	}
}
