/* eslint-disable @wordpress/no-unsafe-wp-apis -- Matches core/button editor styling hooks. */
import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { ToolbarButton, Popover } from '@wordpress/components';
import {
	BlockControls,
	RichText,
	useBlockProps,
	InnerBlocks,
	LinkControl,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalUseBackgroundProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalGetShadowClassesAndStyles as useShadowProps,
	__experimentalGetElementClassName,
	getTypographyClassesAndStyles as useTypographyProps,
} from '@wordpress/block-editor';

const useBackgroundProps =
	__experimentalUseBackgroundProps ||
	( () => ( {
		className: undefined,
		style: {},
	} ) );
import { displayShortcut, isKeyboardEvent } from '@wordpress/keycodes';
import { link } from '@wordpress/icons';
import ButtonIconControls from './button-icon-controls';
import { getRegisteredIconBlocks } from './get-registered-icon-blocks';
import { getIconTemplateAttributes } from './get-icon-template-attributes';
import { getUpdatedLinkAttributes } from './get-updated-link-attributes';
import {
	BUTTON_LABEL_CLASS_NAME,
	ICON_POSITION_RIGHT,
	NEW_TAB_TARGET,
	NOFOLLOW_REL,
} from './constants';
import { getButtonIconGapStyle } from './get-button-icon-gap-style';
import { normalizeButtonLabelText } from './normalize-button-label-text';

const LINK_SETTINGS = [
	...LinkControl.DEFAULT_LINK_SETTINGS,
	{
		id: 'nofollow',
		title: __( 'Mark as nofollow', 'blockparty-button-icon' ),
	},
];

/**
 * Editor UI for core/button with optional core/icon inner blocks.
 *
 * @param {Object} props Block edit props.
 * @return {Element} Edit element.
 */
export default function ButtonIconEdit( props ) {
	const { attributes, setAttributes, clientId, isSelected, className } =
		props;
	const {
		tagName,
		linkTarget,
		placeholder,
		rel,
		style,
		text,
		url,
		hasIcon,
		iconPosition,
	} = attributes;

	const TagName = tagName || 'a';
	const isLinkTag = 'a' === TagName;
	const registeredIconBlocks = getRegisteredIconBlocks();
	const hasIconBlock = registeredIconBlocks.length > 0;
	const templateIconBlock = registeredIconBlocks[ 0 ];

	useEffect( () => {
		if ( ! hasIcon ) {
			return;
		}

		const normalized = normalizeButtonLabelText( text );
		if ( normalized !== text ) {
			setAttributes( { text: normalized } );
		}
	}, [ hasIcon, text, setAttributes ] );

	const [ isEditingURL, setIsEditingURL ] = useState( false );
	const [ popoverAnchor, setPopoverAnchor ] = useState( null );
	const richTextRef = useRef();

	const borderProps = useBorderProps( attributes );
	const colorProps = useColorProps( attributes );
	const spacingProps = useSpacingProps( attributes );
	const shadowProps = useShadowProps( attributes );
	const backgroundProps = useBackgroundProps( attributes );
	const typographyProps = useTypographyProps( attributes );

	const blockProps = useBlockProps( {
		ref: setPopoverAnchor,
		className: clsx( {
			'blockparty-button-icon': hasIcon,
			'blockparty-button-icon--left':
				hasIcon && iconPosition !== ICON_POSITION_RIGHT,
			'blockparty-button-icon--right':
				hasIcon && iconPosition === ICON_POSITION_RIGHT,
		} ),
		onKeyDown( event ) {
			if ( isKeyboardEvent.primary( event, 'k' ) ) {
				event.preventDefault();
				setIsEditingURL( true );
			}
		},
	} );

	const isURLSet = !! url;
	const opensInNewTab = linkTarget === NEW_TAB_TARGET;
	const nofollow = !! rel?.includes( NOFOLLOW_REL );

	const linkValue = useMemo(
		() => ( { url, opensInNewTab, nofollow } ),
		[ url, opensInNewTab, nofollow ]
	);

	useEffect( () => {
		if ( ! isSelected ) {
			setIsEditingURL( false );
		}
	}, [ isSelected ] );

	const buttonClasses = clsx(
		className,
		'wp-block-button__link',
		colorProps.className,
		backgroundProps.className,
		borderProps.className,
		typographyProps.className,
		{
			'no-border-radius': style?.border?.radius === 0,
			'has-custom-font-size': blockProps.style?.fontSize,
		},
		__experimentalGetElementClassName( 'button' )
	);

	const buttonStyle = {
		...borderProps.style,
		...colorProps.style,
		...backgroundProps.style,
		...spacingProps.style,
		...shadowProps.style,
		...typographyProps.style,
		...getButtonIconGapStyle( attributes ),
		writingMode: undefined,
	};

	const iconInnerBlocks = hasIcon && hasIconBlock && (
		<InnerBlocks
			allowedBlocks={ registeredIconBlocks }
			templateLock="insert"
			template={ [
				[
					templateIconBlock,
					{
						...getIconTemplateAttributes(),
						lock: {
							move: true,
							remove: true,
						},
					},
				],
			] }
			templateInsertUpdatesSelection={ false }
			directInsert={ false }
			renderAppender={ false }
		/>
	);

	let buttonContent;

	if ( ! hasIcon ) {
		buttonContent = (
			<RichText
				ref={ richTextRef }
				aria-label={ __( 'Button text', 'blockparty-button-icon' ) }
				placeholder={
					placeholder || __( 'Add text…', 'blockparty-button-icon' )
				}
				value={ text }
				onChange={ ( value ) => {
					setAttributes( { text: value } );
				} }
				withoutInteractiveFormatting
				tagName={ TagName }
				type={
					'button' === TagName ? attributes.type || 'button' : null
				}
				className={ buttonClasses }
				style={ buttonStyle }
				href={ isLinkTag ? url : null }
				target={ isLinkTag ? linkTarget : null }
				rel={ isLinkTag ? rel : null }
				identifier="text"
			/>
		);
	} else if ( isLinkTag ) {
		buttonContent = (
			<a
				className={ buttonClasses }
				style={ buttonStyle }
				href={ url || '#' }
				target={ linkTarget }
				rel={ rel }
				onClick={ ( event ) => {
					event.preventDefault();
				} }
			>
				{ iconInnerBlocks }
				<RichText
					ref={ richTextRef }
					tagName="span"
					className={ BUTTON_LABEL_CLASS_NAME }
					aria-label={ __( 'Button text', 'blockparty-button-icon' ) }
					placeholder={
						placeholder ||
						__( 'Add text…', 'blockparty-button-icon' )
					}
					value={ text }
					onChange={ ( value ) => {
						setAttributes( { text: value } );
					} }
					withoutInteractiveFormatting
					identifier="text"
				/>
			</a>
		);
	} else {
		buttonContent = (
			<button
				type={ attributes.type || 'button' }
				className={ buttonClasses }
				style={ buttonStyle }
			>
				{ iconInnerBlocks }
				<RichText
					ref={ richTextRef }
					tagName="span"
					className={ BUTTON_LABEL_CLASS_NAME }
					aria-label={ __( 'Button text', 'blockparty-button-icon' ) }
					placeholder={
						placeholder ||
						__( 'Add text…', 'blockparty-button-icon' )
					}
					value={ text }
					onChange={ ( value ) => {
						setAttributes( { text: value } );
					} }
					withoutInteractiveFormatting
					identifier="text"
				/>
			</button>
		);
	}

	return (
		<>
			<ButtonIconControls
				hasIcon={ hasIcon }
				iconPosition={ iconPosition }
				hasIconBlock={ hasIconBlock }
				clientId={ clientId }
				setAttributes={ setAttributes }
			/>
			<div { ...blockProps }>{ buttonContent }</div>
			{ isLinkTag && (
				<BlockControls group="block">
					<ToolbarButton
						name="link"
						icon={ link }
						title={ __( 'Link', 'blockparty-button-icon' ) }
						shortcut={ displayShortcut.primary( 'k' ) }
						onClick={ () => {
							setIsEditingURL( ! isEditingURL );
						} }
						isActive={ isURLSet }
					/>
				</BlockControls>
			) }
			{ isLinkTag && isSelected && isEditingURL && (
				<Popover
					placement="bottom"
					onClose={ () => {
						setIsEditingURL( false );
						richTextRef.current?.focus();
					} }
					anchor={ popoverAnchor }
					focusOnMount={ isEditingURL ? 'firstElement' : false }
					__unstableSlotName="__unstable-block-tools-after"
					shift
				>
					<LinkControl
						value={ linkValue }
						onChange={ ( {
							url: newURL,
							opensInNewTab: newOpensInNewTab,
							nofollow: newNofollow,
						} ) =>
							setAttributes(
								getUpdatedLinkAttributes( {
									rel,
									url: newURL,
									opensInNewTab: newOpensInNewTab,
									nofollow: newNofollow,
								} )
							)
						}
						onRemove={ () => {
							setAttributes( {
								url: undefined,
								linkTarget: undefined,
								rel: undefined,
							} );
							setIsEditingURL( false );
							richTextRef.current?.focus();
						} }
						forceIsEditingLink={ ! isURLSet }
						settings={ LINK_SETTINGS }
					/>
				</Popover>
			) }
		</>
	);
}
