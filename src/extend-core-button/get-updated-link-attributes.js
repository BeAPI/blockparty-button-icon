import { NEW_TAB_TARGET, NOFOLLOW_REL } from './constants';

/**
 * Maps LinkControl values to core/button link attributes.
 *
 * @param {Object}  options                 Link control state.
 * @param {string}  [options.rel]           Current rel attribute.
 * @param {string}  [options.url]           Link URL.
 * @param {boolean} [options.opensInNewTab] Open in new tab.
 * @param {boolean} [options.nofollow]      Nofollow flag.
 * @return {Object} Button attribute updates.
 */
export const getUpdatedLinkAttributes = ( {
	rel,
	url,
	opensInNewTab,
	nofollow,
} ) => {
	let nextRel = rel;

	if ( nofollow ) {
		nextRel = nextRel ? `${ nextRel } ${ NOFOLLOW_REL }` : NOFOLLOW_REL;
	} else if ( nextRel ) {
		nextRel = nextRel
			.split( /\s+/ )
			.filter( ( token ) => token && token !== NOFOLLOW_REL )
			.join( ' ' );
	}

	return {
		url,
		linkTarget: opensInNewTab ? NEW_TAB_TARGET : undefined,
		rel: nextRel || undefined,
	};
};
