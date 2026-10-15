import { getBlockType } from '@wordpress/blocks';

const DEFAULT_ICON_BLOCKS = [ 'core/icon' ];

/**
 * Resolves allowed icon blocks from PHP settings, keeping only registered types.
 *
 * @return {string[]} Registered icon block names.
 */
export const getRegisteredIconBlocks = () => {
	const fromPhp = window?.blockpartyButtonIconSettings?.allowedIconBlocks;
	const candidates =
		Array.isArray( fromPhp ) && fromPhp.length > 0
			? fromPhp
			: DEFAULT_ICON_BLOCKS;

	return candidates.filter(
		( blockName ) => typeof getBlockType( blockName ) !== 'undefined'
	);
};
