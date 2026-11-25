/**
 * WordPress dependencies
 */
import { test, expect } from '../utils/fixtures';

const BUTTON_WITH_ICON_MARKUP = `<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"hasIcon":true} -->
<div class="wp-block-button blockparty-button-icon blockparty-button-icon--left"><a class="wp-block-button__link wp-element-button"><!-- wp:icon {"icon":"core/arrow-right"} /--><span class="wp-block-button__label">Front label</span></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->`;

const BUTTON_ICON_ONLY_MARKUP = `<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"hasIcon":true,"iconPosition":"only"} -->
<div class="wp-block-button blockparty-button-icon blockparty-button-icon--only"><a class="wp-block-button__link wp-element-button" href="#"><!-- wp:icon {"icon":"core/arrow-right"} /--><span class="wp-block-button__label">Icon only label</span></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->`;

// v1.0.0 icon-only pattern: empty label, name carried by the icon aria-label.
const LEGACY_EMPTY_LABEL_MARKUP = `<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"hasIcon":true} -->
<div class="wp-block-button blockparty-button-icon blockparty-button-icon--left"><a class="wp-block-button__link wp-element-button" href="#legacy"><!-- wp:icon {"icon":"core/arrow-right","ariaLabel":"Legacy icon name"} /--><span class="wp-block-button__label"></span></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->`;

test.describe( 'Blockparty Button Icon frontend', () => {
	let post;

	test.beforeEach( async ( { requestUtils } ) => {
		post = await requestUtils.createPost( {
			title: 'Blockparty Button Icon E2E',
			content:
				BUTTON_WITH_ICON_MARKUP +
				BUTTON_ICON_ONLY_MARKUP +
				LEGACY_EMPTY_LABEL_MARKUP,
			status: 'publish',
		} );
	} );

	test.afterEach( async ( { requestUtils } ) => {
		if ( post?.id ) {
			await requestUtils.rest( {
				method: 'DELETE',
				path: `/wp/v2/posts/${ post.id }`,
				params: { force: true },
			} );
		}
	} );

	test( 'renders the icon wrapper as a span inside the button link', async ( {
		page,
	} ) => {
		await page.goto( post.link );

		const button = page
			.locator(
				'.wp-block-button.blockparty-button-icon--left a.wp-block-button__link'
			)
			.filter( { hasText: 'Front label' } );
		await expect( button ).toBeVisible();
		await expect( button.getByText( 'Front label' ) ).toBeVisible();

		const icon = button.locator( '.wp-block-icon' );
		await expect( icon ).toBeVisible();
		await expect( icon ).toHaveJSProperty( 'tagName', 'SPAN' );
	} );

	test( 'keeps an accessible name and hides the label for icon-only buttons', async ( {
		page,
	} ) => {
		await page.goto( post.link );

		const link = page.getByRole( 'link', { name: 'Icon only label' } );
		await expect( link ).toBeVisible();

		const icon = link.locator( '.wp-block-icon' );
		await expect( icon ).toBeVisible();
		await expect( icon ).toHaveAttribute( 'aria-hidden', 'true' );

		const labelBox = await link
			.locator( '.wp-block-button__label' )
			.boundingBox();
		expect( labelBox?.width ?? 0 ).toBeLessThanOrEqual( 1 );
		expect( labelBox?.height ?? 0 ).toBeLessThanOrEqual( 1 );
	} );

	test( 'keeps the icon name for buttons with an empty label', async ( {
		page,
	} ) => {
		await page.goto( post.link );

		const link = page.getByRole( 'link', { name: 'Legacy icon name' } );
		await expect( link ).toBeVisible();
		await expect( link.locator( '.wp-block-icon' ) ).not.toHaveAttribute(
			'aria-hidden',
			'true'
		);
	} );
} );
