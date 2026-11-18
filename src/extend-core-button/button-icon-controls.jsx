import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import {
	Button,
	ToolbarButton,
	ToolbarGroup,
	Notice,
	PanelBody,
	TextControl,
	ToggleControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis -- ToggleGroupControl is not yet a stable export in @wordpress/components.
	__experimentalToggleGroupControl as ToggleGroupControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import {
	ICON_POSITION_LEFT,
	ICON_POSITION_ONLY,
	ICON_POSITION_RIGHT,
} from './constants';
import IconToolbarSvg from './icon-toolbar-svg';
import { getInnerIconClientId } from './get-inner-icon-client-id';
import { openIconInserterForBlock } from './open-icon-inserter';
import {
	getButtonLabelPlainText,
	plainTextToButtonLabel,
} from './button-label-plain-text';

/**
 * Toolbar and inspector controls for button icons.
 *
 * @param {Object}                         props               Component props.
 * @param {boolean}                        props.hasIcon       Whether the button shows an icon.
 * @param {string}                         props.iconPosition  Icon position relative to label.
 * @param {boolean}                        props.hasIconBlock  Whether core/icon is available.
 * @param {string}                         props.clientId      Button block client id.
 * @param {string}                         [props.text]        Button label (rich-text HTML).
 * @param {( attributes: Object ) => void} props.setAttributes Attribute updater.
 * @return {Element} Controls fragment.
 */
export default function ButtonIconControls( {
	hasIcon,
	iconPosition,
	hasIconBlock,
	clientId,
	text,
	setAttributes,
} ) {
	const iconClientId = useSelect(
		( select ) => getInnerIconClientId( select, clientId ),
		[ clientId ]
	);
	const isIconOnly = hasIcon && iconPosition === ICON_POSITION_ONLY;
	const plainLabel = getButtonLabelPlainText( text );
	const isLabelMissing = isIconOnly && '' === plainLabel.trim();

	return (
		<>
			<BlockControls key="toolbar">
				<ToolbarGroup>
					{ hasIcon ? (
						<ToolbarButton
							onClick={ () => {
								setAttributes( { hasIcon: false } );
							} }
						>
							{ __( 'Remove icon', 'blockparty-button-icon' ) }
						</ToolbarButton>
					) : (
						<ToolbarButton
							icon={ <IconToolbarSvg /> }
							label={ __( 'Icon', 'blockparty-button-icon' ) }
							isDisabled={ ! hasIconBlock }
							onClick={ () => {
								setAttributes( { hasIcon: true } );
							} }
						/>
					) }
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls group="styles">
				<PanelBody
					title={ __( 'Icon', 'blockparty-button-icon' ) }
					initialOpen={ hasIcon }
				>
					<ToggleControl
						label={ __( 'Show icon', 'blockparty-button-icon' ) }
						checked={ hasIcon }
						disabled={ ! hasIconBlock }
						onChange={ ( value ) => {
							setAttributes( { hasIcon: value } );
						} }
					/>
					{ hasIcon && (
						<>
							<ToggleGroupControl
								label={ __(
									'Icon position',
									'blockparty-button-icon'
								) }
								value={ iconPosition }
								isBlock
								__next40pxDefaultSize
								onChange={ ( value ) => {
									setAttributes( { iconPosition: value } );
								} }
							>
								<ToggleGroupControlOption
									value={ ICON_POSITION_LEFT }
									label={ __(
										'Left',
										'blockparty-button-icon'
									) }
								/>
								<ToggleGroupControlOption
									value={ ICON_POSITION_RIGHT }
									label={ __(
										'Right',
										'blockparty-button-icon'
									) }
								/>
								<ToggleGroupControlOption
									value={ ICON_POSITION_ONLY }
									label={ __(
										'Icon only',
										'blockparty-button-icon'
									) }
								/>
							</ToggleGroupControl>
							{ isIconOnly && (
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
											setAttributes( {
												text: plainTextToButtonLabel(
													value
												),
											} );
										} }
									/>
									{ isLabelMissing && (
										<Notice
											status="error"
											isDismissible={ false }
										>
											{ __(
												'A label is required for an icon-only button to be accessible.',
												'blockparty-button-icon'
											) }
										</Notice>
									) }
								</>
							) }
							<Button
								variant="secondary"
								__next40pxDefaultSize
								disabled={ ! iconClientId }
								style={ {
									width: '100%',
									justifyContent: 'center',
								} }
								onClick={ () => {
									openIconInserterForBlock( iconClientId );
								} }
							>
								{ __(
									'Replace Icon',
									'blockparty-button-icon'
								) }
							</Button>
						</>
					) }
				</PanelBody>
			</InspectorControls>
		</>
	);
}
