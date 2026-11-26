/**
 * Converts the button rich-text label to plain text (for a TextControl).
 *
 * Uses DOMParser so the markup is parsed in an inert document (no script or
 * resource loading).
 *
 * @param {string|undefined} html Rich-text HTML.
 * @return {string} Plain text.
 */
export function getButtonLabelPlainText( html ) {
	if ( ! html ) {
		return '';
	}

	const doc = new window.DOMParser().parseFromString(
		`<body>${ html }</body>`,
		'text/html'
	);

	return doc.body.textContent || '';
}

/**
 * Escapes plain text so it can be stored in the rich-text `text` attribute.
 *
 * @param {string} text Plain text typed by the editor.
 * @return {string} HTML-safe text.
 */
export function plainTextToButtonLabel( text ) {
	return ( text || '' )
		.replace( /&/g, '&amp;' )
		.replace( /</g, '&lt;' )
		.replace( />/g, '&gt;' );
}
