import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Removes nested icon blocks when hasIcon is cleared.
 *
 * Lives outside ButtonIconEdit so cleanup still runs after that edit UI unmounts.
 * Uses replaceInnerBlocks (not removeBlocks): icon blocks are inserted with
 * lock.remove true, so canRemoveBlock would no-op a removeBlocks dispatch.
 *
 * @param {Object}  props          Component props.
 * @param {string}  props.clientId Button block client id.
 * @param {boolean} props.hasIcon  Whether the button shows an icon.
 * @return {null} Nothing.
 */
export default function ClearIconBlocksWhenDisabled( { clientId, hasIcon } ) {
	const innerBlocks = useSelect(
		( select ) => select( blockEditorStore ).getBlocks( clientId ),
		[ clientId ]
	);
	const { replaceInnerBlocks } = useDispatch( blockEditorStore );

	useEffect( () => {
		if ( hasIcon || innerBlocks.length === 0 ) {
			return;
		}

		replaceInnerBlocks( clientId, [], false );
	}, [ clientId, hasIcon, innerBlocks, replaceInnerBlocks ] );

	return null;
}
