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
	 * Registers the render block filter.
	 */
	private function __construct() {
		add_filter( 'render_block_core/icon', array( $this, 'render_icon_as_span' ), 10, 2 );
	}

	/**
	 * Renders core/icon with a span wrapper when used inside button links (valid phrasing content).
	 *
	 * @param string $block_content Rendered block HTML.
	 * @param array  $block         Block data.
	 * @return string Filtered HTML.
	 */
	public function render_icon_as_span( string $block_content, array $block ): string {
		if ( 'core/icon' !== ( $block['blockName'] ?? '' ) || '' === $block_content ) {
			return $block_content;
		}

		return self::convert_icon_wrapper_to_span( $block_content );
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
