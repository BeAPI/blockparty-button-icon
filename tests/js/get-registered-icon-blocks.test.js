/**
 * @jest-environment jsdom
 */

/**
 * Internal dependencies
 */
import { getRegisteredIconBlocks } from '../../src/extend-core-button/get-registered-icon-blocks';

jest.mock( '@wordpress/blocks', () => ( {
	getBlockType: jest.fn(),
} ) );

import { getBlockType } from '@wordpress/blocks';

describe( 'getRegisteredIconBlocks', () => {
	beforeEach( () => {
		getBlockType.mockReset();
		delete window.blockpartyButtonIconSettings;
	} );

	it( 'defaults to core/icon when registered', () => {
		getBlockType.mockImplementation( ( name ) =>
			name === 'core/icon' ? { name } : undefined
		);

		expect( getRegisteredIconBlocks() ).toEqual( [ 'core/icon' ] );
	} );

	it( 'keeps only registered blocks from PHP settings', () => {
		window.blockpartyButtonIconSettings = {
			allowedIconBlocks: [
				'core/icon',
				'blockparty/icon',
				'beapi/icon-block',
			],
		};
		getBlockType.mockImplementation( ( name ) =>
			[ 'core/icon', 'beapi/icon-block' ].includes( name )
				? { name }
				: undefined
		);

		expect( getRegisteredIconBlocks() ).toEqual( [
			'core/icon',
			'beapi/icon-block',
		] );
	} );

	it( 'falls back to defaults when PHP settings are empty', () => {
		window.blockpartyButtonIconSettings = {
			allowedIconBlocks: [],
		};
		getBlockType.mockImplementation( ( name ) =>
			name === 'core/icon' ? { name } : undefined
		);

		expect( getRegisteredIconBlocks() ).toEqual( [ 'core/icon' ] );
	} );

	it( 'returns an empty list when no candidate is registered', () => {
		getBlockType.mockReturnValue( undefined );

		expect( getRegisteredIconBlocks() ).toEqual( [] );
	} );
} );
