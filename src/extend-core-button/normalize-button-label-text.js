import { BUTTON_LABEL_CLASS_NAME } from './constants';

const LABEL_CLASS_PATTERN = BUTTON_LABEL_CLASS_NAME.replace( /-/g, '\\-' );

/**
 * Unwraps a single outer label span when it wraps the entire rich-text value.
 *
 * @param {string} html Rich-text HTML.
 * @return {string} Unwrapped HTML.
 */
function unwrapOuterLabelSpan( html ) {
	const trimmed = html.trim();
	const pattern = new RegExp(
		`^<span\\b[^>]*\\bclass="[^"]*\\b${ LABEL_CLASS_PATTERN }\\b[^"]*"[^>]*>([\\s\\S]*)<\\/span>$`,
		'i'
	);
	const match = trimmed.match( pattern );

	return match ? match[ 1 ].trim() : trimmed;
}

/**
 * Removes legacy nested span wrappers from button label rich text.
 *
 * @param {string|undefined} text Serialized rich-text HTML.
 * @return {string|undefined} Normalized value for RichText save (no outer label span).
 */
export function normalizeButtonLabelText( text ) {
	if ( ! text ) {
		return text;
	}

	let normalized = text.trim();
	let didUnwrap = true;

	while ( didUnwrap ) {
		const unwrapped = unwrapOuterLabelSpan( normalized );
		didUnwrap = unwrapped !== normalized;
		normalized = unwrapped;
	}

	if ( normalized.includes( '<span' ) ) {
		const withoutSpans = normalized.replace( /<\/?span\b[^>]*>/gi, '' );

		if ( withoutSpans.length ) {
			normalized = withoutSpans;
		}
	}

	return normalized;
}
