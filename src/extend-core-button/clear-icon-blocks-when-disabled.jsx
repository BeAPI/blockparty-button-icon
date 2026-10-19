import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Removes nested icon blocks when hasIcon is cleared.
 *
 * Lives outside ButtonIconEdit so cleanup still runs after that edit UI unmounts.
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
	const { removeBlocks } = useDispatch( blockEditorStore );

	useEffect( () => {
		if ( hasIcon || innerBlocks.length === 0 ) {
			return;
		}

		removeBlocks(
			innerBlocks.map( ( block ) => block.clientId ),
			false
		);
	}, [ hasIcon, innerBlocks, removeBlocks ] );

	return null;
}
