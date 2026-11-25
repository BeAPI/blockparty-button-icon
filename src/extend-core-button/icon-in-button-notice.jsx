import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { Notice } from '@wordpress/components';
import { BUTTON_BLOCK_NAME, ICON_POSITION_ONLY } from './constants';
import IconOnlyLabelControl from './icon-only-label-control';
import { getRegisteredIconBlocks } from './get-registered-icon-blocks';

/**
 * Explains, in the icon inspector, how its alternative text behaves inside a button.
 *
 * The front end hides the icon from assistive technologies as soon as the
 * button label has text, so an icon aria-label is only used as a fallback.
 * For icon-only buttons, the icon is the only click target in the canvas, so
 * the required button label field is repeated here.
 */
const withIconInButtonNotice = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, clientId, isSelected } = props;
		const isIconBlock = getRegisteredIconBlocks().includes( name );

		const parentButton = useSelect(
			( select ) => {
				if ( ! isIconBlock || ! isSelected ) {
					return null;
				}

				const { getBlockRootClientId, getBlock } =
					select( blockEditorStore );
				const parent = getBlock( getBlockRootClientId( clientId ) );

				if (
					parent?.name !== BUTTON_BLOCK_NAME ||
					! parent.attributes?.hasIcon
				) {
					return null;
				}

				return {
					clientId: parent.clientId,
					text: parent.attributes.text,
					isIconOnly:
						parent.attributes.iconPosition === ICON_POSITION_ONLY,
				};
			},
			[ clientId, isIconBlock, isSelected ]
		);
		const { updateBlockAttributes } = useDispatch( blockEditorStore );

		return (
			<>
				<BlockEdit { ...props } />
				{ parentButton && (
					<InspectorControls>
						<div className="blockparty-button-icon-notice">
							<Notice status="info" isDismissible={ false }>
								{ __(
									'Inside a button, this icon is decorative: the button label is its accessible name. The icon alternative text is only used when the button label is empty.',
									'blockparty-button-icon'
								) }
							</Notice>
							{ parentButton.isIconOnly && (
								<IconOnlyLabelControl
									text={ parentButton.text }
									onChange={ ( value ) => {
										updateBlockAttributes(
											parentButton.clientId,
											{ text: value }
										);
									} }
								/>
							) }
						</div>
					</InspectorControls>
				) }
			</>
		);
	},
	'withIconInButtonNotice'
);

addFilter(
	'editor.BlockEdit',
	'blockparty/button-icon/icon-in-button-notice',
	withIconInButtonNotice
);
