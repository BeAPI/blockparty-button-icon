import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import {
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { Notice } from '@wordpress/components';
import { BUTTON_BLOCK_NAME } from './constants';
import { getRegisteredIconBlocks } from './get-registered-icon-blocks';

/**
 * Explains, in the icon inspector, how its alternative text behaves inside a button.
 *
 * The front end hides the icon from assistive technologies as soon as the
 * button label has text, so an icon aria-label is only used as a fallback.
 */
const withIconInButtonNotice = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, clientId, isSelected } = props;
		const isIconBlock = getRegisteredIconBlocks().includes( name );

		const isInsideIconButton = useSelect(
			( select ) => {
				if ( ! isIconBlock || ! isSelected ) {
					return false;
				}

				const { getBlockRootClientId, getBlock } =
					select( blockEditorStore );
				const parent = getBlock( getBlockRootClientId( clientId ) );

				return (
					parent?.name === BUTTON_BLOCK_NAME &&
					!! parent.attributes?.hasIcon
				);
			},
			[ clientId, isIconBlock, isSelected ]
		);

		return (
			<>
				<BlockEdit { ...props } />
				{ isInsideIconButton && (
					<InspectorControls>
						<div className="blockparty-button-icon-notice">
							<Notice status="info" isDismissible={ false }>
								{ __(
									'Inside a button, this icon is decorative: the button label is its accessible name. The icon alternative text is only used when the button label is empty.',
									'blockparty-button-icon'
								) }
							</Notice>
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
