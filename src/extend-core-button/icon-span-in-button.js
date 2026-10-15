import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useLayoutEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { BUTTON_BLOCK_NAME } from './constants';

/**
 * Whether the icon block is nested inside a button with icon support enabled.
 *
 * @param {Function} select   Data select function.
 * @param {string}   clientId Icon block client id.
 * @return {boolean} True when inside an icon-enabled core/button.
 */
function isIconInsideButtonIcon( select, clientId ) {
	const parents = select( blockEditorStore ).getBlockParents(
		clientId,
		true
	);

	return parents.some( ( parentId ) => {
		const block = select( blockEditorStore ).getBlock( parentId );

		return block?.name === BUTTON_BLOCK_NAME && block?.attributes?.hasIcon;
	} );
}

/**
 * Replaces the core/icon wrapper div with a span in the block canvas DOM.
 *
 * @param {string} blockClientId Icon block client id.
 */
function replaceIconWrapperDivWithSpan( blockClientId ) {
	const blockElement = document.querySelector(
		`[data-block="${ blockClientId }"]`
	);

	if ( ! blockElement ) {
		return;
	}

	const iconWrapper = blockElement.querySelector( '.wp-block-icon' );

	if ( ! iconWrapper || iconWrapper.tagName !== 'DIV' ) {
		return;
	}

	const span = document.createElement( 'span' );

	[ ...iconWrapper.attributes ].forEach( ( attribute ) => {
		span.setAttribute( attribute.name, attribute.value );
	} );

	span.innerHTML = iconWrapper.innerHTML;
	iconWrapper.replaceWith( span );
}

const withIconSpanWrapperInButton = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const shouldUseSpan = useSelect(
			( select ) =>
				props.name === 'core/icon' &&
				isIconInsideButtonIcon( select, props.clientId ),
			[ props.name, props.clientId ]
		);

		useLayoutEffect( () => {
			if ( ! shouldUseSpan ) {
				return;
			}

			replaceIconWrapperDivWithSpan( props.clientId );
		}, [ shouldUseSpan, props.clientId, props.attributes ] );

		return <BlockEdit { ...props } />;
	},
	'withIconSpanWrapperInButton'
);

addFilter(
	'editor.BlockEdit',
	'blockparty/button-icon/icon-span-in-button',
	withIconSpanWrapperInButton
);
