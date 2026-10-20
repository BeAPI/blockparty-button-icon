/* eslint-disable @wordpress/no-unsafe-wp-apis -- Matches core/button save styling hooks. */
import clsx from 'clsx';
import {
	RichText,
	useBlockProps,
	InnerBlocks,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
	__experimentalGetColorClassesAndStyles as getColorClassesAndStyles,
	__experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles,
	__experimentalGetShadowClassesAndStyles as getShadowClassesAndStyles,
	__experimentalGetElementClassName,
	getTypographyClassesAndStyles,
} from '@wordpress/block-editor';
import { BUTTON_LABEL_CLASS_NAME, ICON_POSITION_RIGHT } from './constants';
import { getButtonIconGapStyle } from './get-button-icon-gap-style';
import { normalizeButtonLabelText } from './normalize-button-label-text';

/**
 * Save markup for core/button with optional core/icon inner blocks.
 *
 * @param {Object} props            Block save props.
 * @param {Object} props.attributes Serialized block attributes.
 * @return {Element} Saved element.
 */
export default function buttonIconSave( { attributes } ) {
	const {
		tagName,
		type,
		fontSize,
		linkTarget,
		rel,
		style,
		text,
		title,
		url,
		hasIcon,
		iconPosition,
	} = attributes;
	const TagName = tagName || 'a';
	const isButtonTag = 'button' === TagName;
	const buttonType = type || 'button';
	const borderProps = getBorderClassesAndStyles( attributes );
	const colorProps = getColorClassesAndStyles( attributes );
	const spacingProps = getSpacingClassesAndStyles( attributes );
	const shadowProps = getShadowClassesAndStyles( attributes );
	const typographyProps = getTypographyClassesAndStyles( attributes );
	const buttonClasses = clsx(
		'wp-block-button__link',
		colorProps.className,
		borderProps.className,
		typographyProps.className,
		{
			'no-border-radius': style?.border?.radius === 0,
			'has-custom-font-size': fontSize || style?.typography?.fontSize,
		},
		__experimentalGetElementClassName( 'button' )
	);
	const buttonStyle = {
		...borderProps.style,
		...colorProps.style,
		...spacingProps.style,
		...shadowProps.style,
		...typographyProps.style,
		...getButtonIconGapStyle( attributes ),
		writingMode: undefined,
	};

	const wrapperProps = useBlockProps.save( {
		className: clsx( {
			'blockparty-button-icon': hasIcon,
			'blockparty-button-icon--left':
				hasIcon && iconPosition !== ICON_POSITION_RIGHT,
			'blockparty-button-icon--right':
				hasIcon && iconPosition === ICON_POSITION_RIGHT,
		} ),
	} );

	const linkProps = {
		className: buttonClasses,
		style: buttonStyle,
		title,
	};

	if ( isButtonTag ) {
		linkProps.type = buttonType;
	} else {
		linkProps.href = url;
		linkProps.target = linkTarget;
		linkProps.rel = rel;
	}

	if ( ! hasIcon ) {
		return (
			<div { ...wrapperProps }>
				<RichText.Content
					tagName={ TagName }
					value={ text }
					{ ...linkProps }
				/>
			</div>
		);
	}

	return (
		<div { ...wrapperProps }>
			<TagName { ...linkProps }>
				<InnerBlocks.Content />
				<RichText.Content
					tagName="span"
					className={ BUTTON_LABEL_CLASS_NAME }
					value={ normalizeButtonLabelText( text ) }
				/>
			</TagName>
		</div>
	);
}
