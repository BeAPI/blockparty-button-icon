import { __ } from '@wordpress/i18n';
import { Notice, TextControl } from '@wordpress/components';
import {
	getButtonLabelPlainText,
	plainTextToButtonLabel,
} from './button-label-plain-text';

/**
 * Required screen-reader label field for icon-only buttons.
 *
 * Shared by the button inspector and the inner icon inspector, so the label
 * stays reachable whichever block is selected.
 *
 * @param {Object}                   props          Component props.
 * @param {string}                   [props.text]   Button label (rich-text HTML).
 * @param {( text: string ) => void} props.onChange Receives the escaped label.
 * @return {Element} Field and error notice.
 */
export default function IconOnlyLabelControl( { text, onChange } ) {
	const plainLabel = getButtonLabelPlainText( text );
	const isLabelMissing = '' === plainLabel.trim();

	return (
		<>
			<TextControl
				label={ __(
					'Label (screen readers)',
					'blockparty-button-icon'
				) }
				help={ __(
					'Required. Hidden on screen, announced by assistive technologies.',
					'blockparty-button-icon'
				) }
				value={ plainLabel }
				required
				aria-invalid={ isLabelMissing }
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				onChange={ ( value ) => {
					onChange( plainTextToButtonLabel( value ) );
				} }
			/>
			{ isLabelMissing && (
				<Notice status="error" isDismissible={ false }>
					{ __(
						'A label is required for an icon-only button to be accessible.',
						'blockparty-button-icon'
					) }
				</Notice>
			) }
		</>
	);
}
