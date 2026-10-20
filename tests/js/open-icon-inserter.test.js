/**
 * @jest-environment jsdom
 */

/**
 * Internal dependencies
 */
import { isIconLibraryToolbarButton } from '../../src/extend-core-button/open-icon-inserter';

jest.mock( '@wordpress/i18n', () => ( {
	__: ( text ) => text,
} ) );

jest.mock( '@wordpress/data', () => ( {
	dispatch: jest.fn(),
} ) );

jest.mock( '@wordpress/block-editor', () => ( {
	store: 'core/block-editor',
} ) );

/**
 * Build a toolbar button stub for label matching.
 *
 * @param {Object}  options                Options.
 * @param {string}  options.text           Visible button text.
 * @param {boolean} [options.hasSvg]       Whether the button contains an SVG.
 * @param {boolean} [options.disabled]     Whether the button is disabled.
 * @param {string}  [options.ariaDisabled] aria-disabled attribute value.
 * @return {HTMLButtonElement} Button element.
 */
const createButton = ( {
	text,
	hasSvg = false,
	disabled = false,
	ariaDisabled,
} ) => {
	const button = document.createElement( 'button' );
	button.className = 'components-toolbar-button';
	button.textContent = text;
	button.disabled = disabled;

	if ( ariaDisabled !== undefined ) {
		button.setAttribute( 'aria-disabled', ariaDisabled );
	}

	if ( hasSvg ) {
		button.appendChild(
			document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )
		);
	}

	return button;
};

describe( 'isIconLibraryToolbarButton', () => {
	it( 'matches core/icon Choose icon and Replace controls', () => {
		expect(
			isIconLibraryToolbarButton(
				createButton( { text: 'Choose icon' } )
			)
		).toBe( true );
		expect(
			isIconLibraryToolbarButton( createButton( { text: 'Replace' } ) )
		).toBe( true );
	} );

	it( 'does not match the parent Remove icon control', () => {
		expect(
			isIconLibraryToolbarButton(
				createButton( { text: 'Remove icon' } )
			)
		).toBe( false );
	} );

	it( 'ignores icon-only and disabled controls', () => {
		expect(
			isIconLibraryToolbarButton(
				createButton( { text: 'Replace', hasSvg: true } )
			)
		).toBe( false );
		expect(
			isIconLibraryToolbarButton(
				createButton( { text: 'Replace', disabled: true } )
			)
		).toBe( false );
		expect(
			isIconLibraryToolbarButton(
				createButton( { text: 'Replace', ariaDisabled: 'true' } )
			)
		).toBe( false );
	} );
} );
