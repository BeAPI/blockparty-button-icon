import { store as blockEditorStore } from '@wordpress/block-editor';
import { getRegisteredIconBlocks } from './get-registered-icon-blocks';

/**
 * Returns the client id of the first allowed icon inner block.
 *
 * @param {Function} select   Data select function.
 * @param {string}   clientId Parent button block client id.
 * @return {string|undefined} Icon block client id.
 */
export function getInnerIconClientId( select, clientId ) {
	const { getBlocks } = select( blockEditorStore );
	const allowedIconBlocks = getRegisteredIconBlocks();
	const innerBlocks = getBlocks( clientId );

	return innerBlocks.find( ( block ) =>
		allowedIconBlocks.includes( block.name )
	)?.clientId;
}
