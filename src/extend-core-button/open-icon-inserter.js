import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

const MAX_ATTEMPTS = 8;
const RETRY_DELAY_MS = 50;

/**
 * Normalize toolbar button label text for comparison.
 *
 * @param {string} text Raw label text.
 * @return {string} Normalized label.
 */
function normalizeLabel(text) {
	return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

/**
 * Labels used by core/icon to open the icon library modal.
 *
 * @return {Set<string>} Normalized labels.
 */
function getIconLibraryOpenLabels() {
	// Match core/icon toolbar labels (default text domain).
	return new Set(
		[ __( 'Choose icon' ), __( 'Replace' ) ].map( normalizeLabel )
	);
}

/**
 * Whether a toolbar button opens the core/icon library.
 *
 * Must not match the parent button's text-only "Remove icon" control, which
 * can still be in the DOM right after selectBlock switches to core/icon.
 *
 * @param {HTMLElement} button Toolbar button element.
 * @return {boolean} True when the control opens the icon library.
 */
export function isIconLibraryToolbarButton(button) {
	if (
		button.disabled ||
		button.getAttribute('aria-disabled') === 'true'
	) {
		return false;
	}

	const text = button.textContent?.replace(/\s+/g, ' ').trim();
	if (!text) {
		return false;
	}

	// core/icon uses a text-only control; icon-only buttons are unrelated.
	if (button.querySelector('svg')) {
		return false;
	}

	return getIconLibraryOpenLabels().has(normalizeLabel(text));
}

/**
 * Clicks the core/icon toolbar control that opens the icon library modal.
 *
 * @return {boolean} Whether a matching control was clicked.
 */
function clickIconLibraryToolbarButton() {
	const toolbars = document.querySelectorAll(
		'.block-editor-block-contextual-toolbar, .block-editor-block-toolbar'
	);

	for (const toolbar of toolbars) {
		const buttons = toolbar.querySelectorAll(
			'button.components-toolbar-button, button.components-button'
		);

		for (const button of buttons) {
			if (isIconLibraryToolbarButton(button)) {
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
export function openIconInserterForBlock(iconClientId) {
	if (!iconClientId) {
		return;
	}

	const { selectBlock } = dispatch(blockEditorStore);
	selectBlock(iconClientId);

	const tryOpen = (attempt) => {
		if (clickIconLibraryToolbarButton()) {
			return;
		}

		if (attempt < MAX_ATTEMPTS) {
			window.setTimeout(() => tryOpen(attempt + 1), RETRY_DELAY_MS);
		}
	};

	window.requestAnimationFrame(() => tryOpen(0));
}
