/**
 * Internal dependencies
 */
import { getButtonIconClassNames } from '../../src/extend-core-button/get-button-icon-class-names';

const active = ( classes ) =>
	Object.keys( classes ).filter( ( name ) => classes[ name ] );

describe( 'getButtonIconClassNames', () => {
	it( 'returns no active class without icon', () => {
		expect( active( getButtonIconClassNames( false, 'only' ) ) ).toEqual(
			[]
		);
	} );

	it( 'falls back to left for missing or unknown positions', () => {
		expect( active( getButtonIconClassNames( true ) ) ).toEqual( [
			'blockparty-button-icon',
			'blockparty-button-icon--left',
		] );
		expect( active( getButtonIconClassNames( true, 'foo' ) ) ).toEqual( [
			'blockparty-button-icon',
			'blockparty-button-icon--left',
		] );
	} );

	it( 'returns the right modifier', () => {
		expect( active( getButtonIconClassNames( true, 'right' ) ) ).toEqual( [
			'blockparty-button-icon',
			'blockparty-button-icon--right',
		] );
	} );

	it( 'returns the icon-only modifier', () => {
		expect( active( getButtonIconClassNames( true, 'only' ) ) ).toEqual( [
			'blockparty-button-icon',
			'blockparty-button-icon--only',
		] );
	} );
} );
