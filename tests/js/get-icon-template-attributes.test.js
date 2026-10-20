/**
 * Internal dependencies
 */
import { getIconTemplateAttributes } from '../../src/extend-core-button/get-icon-template-attributes';

describe( 'getIconTemplateAttributes', () => {
	it( 'returns core/icon dimension style attributes', () => {
		expect( getIconTemplateAttributes() ).toEqual( {
			style: {
				dimensions: {
					width: '1.25em',
					height: '1.25em',
				},
			},
		} );
	} );
} );
