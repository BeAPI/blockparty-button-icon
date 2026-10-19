import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import {
	Button,
	ToolbarButton,
	ToolbarGroup,
	PanelBody,
	ToggleControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis -- ToggleGroupControl is not yet a stable export in @wordpress/components.
	__experimentalToggleGroupControl as ToggleGroupControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { ICON_POSITION_LEFT, ICON_POSITION_RIGHT } from './constants';
import IconToolbarSvg from './icon-toolbar-svg';
import { getInnerIconClientId } from './get-inner-icon-client-id';
import { openIconInserterForBlock } from './open-icon-inserter';

/**
 * Toolbar and inspector controls for button icons.
 *
 * @param {Object}                         props               Component props.
 * @param {boolean}                        props.hasIcon       Whether the button shows an icon.
 * @param {string}                         props.iconPosition  Icon position relative to label.
 * @param {boolean}                        props.hasIconBlock  Whether core/icon is available.
 * @param {string}                         props.clientId      Button block client id.
 * @param {( attributes: Object ) => void} props.setAttributes Attribute updater.
 * @return {Element} Controls fragment.
 */
export default function ButtonIconControls( {
	hasIcon,
	iconPosition,
	hasIconBlock,
	clientId,
	setAttributes,
} ) {
	const iconClientId = useSelect(
		( select ) => getInnerIconClientId( select, clientId ),
		[ clientId ]
	);

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
							</ToggleGroupControl>
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
