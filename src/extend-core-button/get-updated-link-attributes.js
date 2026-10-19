import { prependHTTPS } from '@wordpress/url';
import { NEW_TAB_REL, NEW_TAB_TARGET, NOFOLLOW_REL } from './constants';

/**
 * Maps LinkControl values to core/button link attributes.
 *
 * Mirrors @wordpress/block-library button helper: toggles nofollow without
 * duplicating tokens, and adds/removes noopener when opening in a new tab.
 *
 * @param {Object}  options                 Link control state.
 * @param {string}  [options.rel]           Current rel attribute.
 * @param {string}  [options.url]           Link URL.
 * @param {boolean} [options.opensInNewTab] Open in new tab.
 * @param {boolean} [options.nofollow]      Nofollow flag.
 * @return {Object} Button attribute updates.
 */
export const getUpdatedLinkAttributes = ( {
	rel = '',
	url = '',
	opensInNewTab,
	nofollow,
} ) => {
	let newLinkTarget;
	let updatedRel = rel;

	if ( opensInNewTab ) {
		newLinkTarget = NEW_TAB_TARGET;
		updatedRel = updatedRel?.includes( NEW_TAB_REL )
			? updatedRel
			: updatedRel + ` ${ NEW_TAB_REL }`;
	} else {
		const relRegex = new RegExp( `\\b${ NEW_TAB_REL }\\s*`, 'g' );
		updatedRel = updatedRel?.replace( relRegex, '' ).trim();
	}

	if ( nofollow ) {
		updatedRel = updatedRel?.includes( NOFOLLOW_REL )
			? updatedRel
			: ( updatedRel + ` ${ NOFOLLOW_REL }` ).trim();
	} else {
		const relRegex = new RegExp( `\\b${ NOFOLLOW_REL }\\s*`, 'g' );
		updatedRel = updatedRel?.replace( relRegex, '' ).trim();
	}

	return {
		url: prependHTTPS( url ),
		linkTarget: newLinkTarget,
		rel: updatedRel || undefined,
	};
};
