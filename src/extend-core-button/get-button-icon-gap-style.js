/* eslint-disable @wordpress/no-unsafe-wp-apis -- getGapCSSValue is experimental. */
import { __experimentalGetGapCSSValue as getGapCSSValue } from '@wordpress/block-editor';

/**
 * Inline gap style for label ↔ icon spacing when the button has an icon.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} React style object (empty when no custom block gap).
 */
export function getButtonIconGapStyle( attributes ) {
	if ( ! attributes?.hasIcon ) {
		return {};
	}

	const gap = getGapCSSValue( attributes.style?.spacing?.blockGap );

	return gap ? { gap } : {};
}
