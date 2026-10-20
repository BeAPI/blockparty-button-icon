/**
 * Internal dependencies
 */
import { normalizeButtonLabelText } from '../../src/extend-core-button/normalize-button-label-text';

describe( 'normalizeButtonLabelText', () => {
	it( 'returns falsy values unchanged', () => {
		expect( normalizeButtonLabelText( undefined ) ).toBeUndefined();
		expect( normalizeButtonLabelText( '' ) ).toBe( '' );
	} );

	it( 'unwraps a single outer label span', () => {
		expect(
			normalizeButtonLabelText(
				'<span class="wp-block-button__label">Hello</span>'
			)
		).toBe( 'Hello' );
	} );

	it( 'unwraps nested outer label spans', () => {
		expect(
			normalizeButtonLabelText(
				'<span class="wp-block-button__label"><span class="wp-block-button__label">Nested</span></span>'
			)
		).toBe( 'Nested' );
	} );

	it( 'strips remaining span tags when content remains', () => {
		expect(
			normalizeButtonLabelText(
				'<span class="wp-block-button__label">Hello <span>world</span></span>'
			)
		).toBe( 'Hello world' );
	} );
} );
