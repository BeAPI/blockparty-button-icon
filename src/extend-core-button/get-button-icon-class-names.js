import { ICON_POSITION_ONLY, ICON_POSITION_RIGHT } from './constants';

/**
 * Wrapper class names describing the icon layout of a button.
 *
 * Shared by edit and save so both stay in sync. Left stays the fallback for
 * unknown or missing positions, which keeps v1.0.0 markup unchanged.
 *
 * @param {boolean} hasIcon      Whether the button shows an icon.
 * @param {string}  iconPosition Icon position (left, right or only).
 * @return {Object<string, boolean>} clsx-compatible class map.
 */
export function getButtonIconClassNames( hasIcon, iconPosition ) {
	const isRight = iconPosition === ICON_POSITION_RIGHT;
	const isOnly = iconPosition === ICON_POSITION_ONLY;

	return {
		'blockparty-button-icon': !! hasIcon,
		'blockparty-button-icon--left': !! hasIcon && ! isRight && ! isOnly,
		'blockparty-button-icon--right': !! hasIcon && isRight,
		'blockparty-button-icon--only': !! hasIcon && isOnly,
	};
}
