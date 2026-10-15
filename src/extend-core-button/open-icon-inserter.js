import { dispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

const MAX_ATTEMPTS = 8;
const RETRY_DELAY_MS = 50;

/**
 * Clicks the core/icon toolbar control that opens the icon library modal.
 *
 * @return {boolean} Whether a matching control was clicked.
 */
function clickIconLibraryToolbarButton() {
	const toolbars = document.querySelectorAll(
		'.block-editor-block-contextual-toolbar, .block-editor-block-toolbar'
	);

	for ( const toolbar of toolbars ) {
		const buttons = toolbar.querySelectorAll(
			'button.components-toolbar-button, button.components-button'
		);

		for ( const button of buttons ) {
			if (
				button.disabled ||
				button.getAttribute( 'aria-disabled' ) === 'true'
			) {
				continue;
			}

			const text = button.textContent?.replace( /\s+/g, ' ' ).trim();
			const hasSvg = Boolean( button.querySelector( 'svg' ) );

			// core/icon uses a text-only toolbar button for Choose icon / Replace.
			if ( text && text.length >= 2 && ! hasSvg ) {
				button.click();
				return true;
			}
		}
	}

	return false;
}

/**
 * Selects the inner core/icon block and opens its native icon library modal.
 *
 * @param {string} iconClientId Inner icon block client id.
 */
export function openIconInserterForBlock( iconClientId ) {
	if ( ! iconClientId ) {
		return;
	}

	const { selectBlock } = dispatch( blockEditorStore );
	selectBlock( iconClientId );

	const tryOpen = ( attempt ) => {
		if ( clickIconLibraryToolbarButton() ) {
			return;
		}

		if ( attempt < MAX_ATTEMPTS ) {
			window.setTimeout( () => tryOpen( attempt + 1 ), RETRY_DELAY_MS );
		}
	};

	window.requestAnimationFrame( () => tryOpen( 0 ) );
}
