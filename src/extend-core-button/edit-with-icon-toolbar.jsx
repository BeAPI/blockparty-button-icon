import ButtonIconEdit from './edit';
import ButtonIconControls from './button-icon-controls';
import ClearIconBlocksWhenDisabled from './clear-icon-blocks-when-disabled';
import { getRegisteredIconBlocks } from './get-registered-icon-blocks';

/**
 * Routes core/button to the icon-aware edit UI or the core edit with toolbar.
 *
 * @param {Object}   props        Block edit props.
 * @param {Function} OriginalEdit Core button edit component.
 * @return {Element} Edit element.
 */
export default function EditWithIconToolbar( props, OriginalEdit ) {
	const { attributes, setAttributes, clientId } = props;
	const { hasIcon, iconPosition } = attributes;
	const hasIconBlock = getRegisteredIconBlocks().length > 0;

	return (
		<>
			<ClearIconBlocksWhenDisabled
				clientId={ clientId }
				hasIcon={ hasIcon }
			/>
			{ hasIcon ? (
				<ButtonIconEdit { ...props } />
			) : (
				<>
					<ButtonIconControls
						hasIcon={ hasIcon }
						iconPosition={ iconPosition }
						hasIconBlock={ hasIconBlock }
						clientId={ clientId }
						setAttributes={ setAttributes }
					/>
					<OriginalEdit { ...props } />
				</>
			) }
		</>
	);
}
