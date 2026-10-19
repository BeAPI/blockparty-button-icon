import { addFilter } from '@wordpress/hooks';
import {
	BUTTON_BLOCK_NAME,
	BUTTON_ICON_ATTRIBUTES,
	BUTTON_LABEL_CLASS_NAME,
} from './constants';
import EditWithIconToolbar from './edit-with-icon-toolbar';
import { normalizeButtonLabelText } from './normalize-button-label-text';
import buttonIconSave from './save';

const LABEL_CLASS_SELECTOR = `.${ BUTTON_LABEL_CLASS_NAME }`;
const BUTTON_TEXT_SELECTOR = `a.wp-block-button__link:not(:has(> ${ LABEL_CLASS_SELECTOR })), button.wp-element-button:not(:has(> ${ LABEL_CLASS_SELECTOR })), ${ LABEL_CLASS_SELECTOR }`;

/**
 * Extends core/button with icon-related attributes and custom edit/save.
 *
 * @param {Object} settings Block type settings.
 * @param {string} name     Block name.
 * @return {Object} Filtered settings.
 */
const extendCoreButtonSettings = ( settings, name ) => {
	if ( name !== BUTTON_BLOCK_NAME ) {
		return settings;
	}

	const OriginalEdit = settings.edit;
	const OriginalSave = settings.save;
	const spacingSupport = settings.supports?.spacing ?? {};
	const textAttribute = settings.attributes?.text ?? {};

	return {
		...settings,
		supports: {
			...settings.supports,
			spacing: {
				...spacingSupport,
				blockGap: {
					sides: [ 'horizontal' ],
				},
				__experimentalDefaultControls: {
					...spacingSupport.__experimentalDefaultControls,
					blockGap: {
						sides: [ 'horizontal' ],
					},
				},
			},
		},
		attributes: {
			...settings.attributes,
			...BUTTON_ICON_ATTRIBUTES,
			text: {
				...textAttribute,
				selector: BUTTON_TEXT_SELECTOR,
			},
		},
		edit( props ) {
			return EditWithIconToolbar( props, OriginalEdit );
		},
		save( props ) {
			if ( props.attributes.hasIcon ) {
				return buttonIconSave( props );
			}

			return OriginalSave( props );
		},
	};
};

addFilter(
	'blocks.registerBlockType',
	'blockparty/button-icon/extend-core-button',
	extendCoreButtonSettings
);

addFilter(
	'blocks.getBlockAttributes',
	'blockparty/button-icon/normalize-button-text',
	( blockAttributes, blockType ) => {
		if (
			blockType.name !== BUTTON_BLOCK_NAME ||
			! blockAttributes.hasIcon
		) {
			return blockAttributes;
		}

		const normalized = normalizeButtonLabelText( blockAttributes.text );

		if ( normalized === blockAttributes.text ) {
			return blockAttributes;
		}

		return {
			...blockAttributes,
			text: normalized,
		};
	}
);
