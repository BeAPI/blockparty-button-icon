/**
 * Internal dependencies
 */
import { getButtonIconGapStyle } from '../../src/extend-core-button/get-button-icon-gap-style';

jest.mock( '@wordpress/block-editor', () => ( {
	__experimentalGetGapCSSValue: jest.fn(),
} ) );

import { __experimentalGetGapCSSValue as getGapCSSValue } from '@wordpress/block-editor';

describe( 'getButtonIconGapStyle', () => {
	beforeEach( () => {
		getGapCSSValue.mockReset();
	} );

	it( 'returns an empty object when hasIcon is false', () => {
		expect( getButtonIconGapStyle( { hasIcon: false } ) ).toEqual( {} );
		expect( getGapCSSValue ).not.toHaveBeenCalled();
	} );

	it( 'returns gap style when hasIcon and blockGap resolve', () => {
		getGapCSSValue.mockReturnValue( '0.5rem' );

		expect(
			getButtonIconGapStyle( {
				hasIcon: true,
				style: { spacing: { blockGap: '0.5rem' } },
			} )
		).toEqual( { gap: '0.5rem' } );
	} );

	it( 'returns an empty object when gap value is empty', () => {
		getGapCSSValue.mockReturnValue( '' );

		expect(
			getButtonIconGapStyle( {
				hasIcon: true,
				style: { spacing: { blockGap: null } },
			} )
		).toEqual( {} );
	} );
} );
