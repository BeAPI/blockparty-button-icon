/**
 * Internal dependencies
 */
import { getInnerIconClientId } from '../../src/extend-core-button/get-inner-icon-client-id';

jest.mock( '../../src/extend-core-button/get-registered-icon-blocks', () => ( {
	getRegisteredIconBlocks: jest.fn(),
} ) );

jest.mock( '@wordpress/block-editor', () => ( {
	store: 'core/block-editor',
} ) );

import { getRegisteredIconBlocks } from '../../src/extend-core-button/get-registered-icon-blocks';

describe( 'getInnerIconClientId', () => {
	beforeEach( () => {
		getRegisteredIconBlocks.mockReset();
	} );

	it( 'returns the first allowed icon inner block client id', () => {
		getRegisteredIconBlocks.mockReturnValue( [ 'core/icon' ] );
		const select = () => ( {
			getBlocks: () => [
				{ name: 'core/paragraph', clientId: 'p-1' },
				{ name: 'core/icon', clientId: 'icon-1' },
			],
		} );

		expect( getInnerIconClientId( select, 'button-1' ) ).toBe( 'icon-1' );
	} );

	it( 'returns undefined when no allowed icon is present', () => {
		getRegisteredIconBlocks.mockReturnValue( [ 'core/icon' ] );
		const select = () => ( {
			getBlocks: () => [ { name: 'core/paragraph', clientId: 'p-1' } ],
		} );

		expect( getInnerIconClientId( select, 'button-1' ) ).toBeUndefined();
	} );
} );
