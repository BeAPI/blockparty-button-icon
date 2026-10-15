export const BUTTON_BLOCK_NAME = 'core/button';

/** Rich-text wrapper for button label when an icon inner block is present. */
export const BUTTON_LABEL_CLASS_NAME = 'wp-block-button__label';

export const ICON_POSITION_LEFT = 'left';
export const ICON_POSITION_RIGHT = 'right';

export const BUTTON_ICON_ATTRIBUTES = {
	hasIcon: {
		type: 'boolean',
		default: false,
	},
	iconPosition: {
		type: 'string',
		default: ICON_POSITION_LEFT,
	},
};

export const NEW_TAB_TARGET = '_blank';
export const NOFOLLOW_REL = 'nofollow';
