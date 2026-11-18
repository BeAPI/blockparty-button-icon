/**
 * Internal dependencies
 */
import {
	getButtonLabelPlainText,
	plainTextToButtonLabel,
} from '../../src/extend-core-button/button-label-plain-text';

describe( 'getButtonLabelPlainText', () => {
	it( 'returns an empty string for empty values', () => {
		expect( getButtonLabelPlainText( undefined ) ).toBe( '' );
		expect( getButtonLabelPlainText( '' ) ).toBe( '' );
	} );

	it( 'strips markup and decodes entities', () => {
		expect(
			getButtonLabelPlainText( '<strong>Read</strong> more &amp; more' )
		).toBe( 'Read more & more' );
	} );
} );

describe( 'plainTextToButtonLabel', () => {
	it( 'escapes HTML special characters', () => {
		expect( plainTextToButtonLabel( 'A & <b>' ) ).toBe(
			'A &amp; &lt;b&gt;'
		);
	} );

	it( 'round-trips with getButtonLabelPlainText', () => {
		const value = 'Next <page> & co';
		expect(
			getButtonLabelPlainText( plainTextToButtonLabel( value ) )
		).toBe( value );
	} );
} );
