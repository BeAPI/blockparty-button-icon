/**
 * WordPress dependencies
 */
import { test, expect } from '../utils/fixtures';

const BUTTON_WITH_ICON_MARKUP = `<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"hasIcon":true} -->
<div class="wp-block-button blockparty-button-icon blockparty-button-icon--left"><a class="wp-block-button__link wp-element-button"><!-- wp:icon {"icon":"core/arrow-right"} /--><span class="wp-block-button__label">Front label</span></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->`;

test.describe( 'Blockparty Button Icon frontend', () => {
	let post;

	test.beforeEach( async ( { requestUtils } ) => {
		post = await requestUtils.createPost( {
			title: 'Blockparty Button Icon E2E',
			content: BUTTON_WITH_ICON_MARKUP,
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

		const button = page.locator(
			'.wp-block-button.blockparty-button-icon a.wp-block-button__link'
		);
		await expect( button ).toBeVisible();
		await expect( button.getByText( 'Front label' ) ).toBeVisible();

		const icon = button.locator( '.wp-block-icon' );
		await expect( icon ).toBeVisible();
		await expect( icon ).toHaveJSProperty( 'tagName', 'SPAN' );
	} );
} );
