<?php
/**
 * Allowed inner icon block types for core/button.
 *
 * @package Blockparty\ButtonIcon
 */

namespace Blockparty\ButtonIcon;

/**
 * Resolves which block types may be inserted as button icons.
 */
class AllowedIconBlocks {

	/**
	 * Default icon block names.
	 *
	 * @var string[]
	 */
	private const DEFAULT_BLOCKS = array( 'core/icon' );

	/**
	 * Allowed icon block types inside core/button.
	 *
	 * @return string[] Block names (e.g. core/icon).
	 */
	public static function get(): array {
		/**
		 * Filters icon blocks that may be inserted into core/button.
		 *
		 * @param string[] $defaults Default block names.
		 */
		$blocks = apply_filters( 'blockparty_button_icon_allowed_icon_blocks', self::DEFAULT_BLOCKS );

		if ( ! is_array( $blocks ) ) {
			return self::DEFAULT_BLOCKS;
		}

		$sanitized = array();
		foreach ( $blocks as $block_name ) {
			if ( is_string( $block_name ) && '' !== $block_name ) {
				$sanitized[] = $block_name;
			}
		}

		return array_values( array_unique( $sanitized ) );
	}
}
