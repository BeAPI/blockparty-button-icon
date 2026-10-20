/**
 * Internal dependencies
 */
import { getUpdatedLinkAttributes } from '../../src/extend-core-button/get-updated-link-attributes';

describe( 'getUpdatedLinkAttributes', () => {
	it( 'adds target and noopener when opening in a new tab', () => {
		expect(
			getUpdatedLinkAttributes( {
				url: 'example.com',
				opensInNewTab: true,
				nofollow: false,
			} )
		).toEqual( {
			url: 'https://example.com',
			linkTarget: '_blank',
			rel: 'noopener',
		} );
	} );

	it( 'adds nofollow without duplicating tokens', () => {
		expect(
			getUpdatedLinkAttributes( {
				rel: 'noopener nofollow',
				url: 'https://example.com',
				opensInNewTab: true,
				nofollow: true,
			} )
		).toEqual( {
			url: 'https://example.com',
			linkTarget: '_blank',
			rel: 'noopener nofollow',
		} );
	} );

	it( 'removes noopener and nofollow when flags are cleared', () => {
		expect(
			getUpdatedLinkAttributes( {
				rel: 'noopener nofollow',
				url: 'https://example.com',
				opensInNewTab: false,
				nofollow: false,
			} )
		).toEqual( {
			url: 'https://example.com',
			linkTarget: undefined,
			rel: undefined,
		} );
	} );
} );
