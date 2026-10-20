/**
 * WordPress dependencies
 */
import { test, expect } from '../utils/fixtures';

/**
 * Resolve the block editor content root.
 *
 * WordPress 6.4+ uses an iframed canvas (`editor-canvas`). Detect the canvas
 * mode explicitly: `FrameLocator.or()` is unreliable when the iframe is absent.
 *
 * @param {import('@playwright/test').Page} page
 */
const getEditorCanvas = async ( page ) => {
	const iframe = page.locator( 'iframe[name="editor-canvas"]' );
	const hasIframe = await iframe
		.waitFor( { state: 'attached', timeout: 3_000 } )
		.then( () => true )
		.catch( () => false );

	if ( hasIframe ) {
		return page.frameLocator( 'iframe[name="editor-canvas"]' );
	}

	return page.locator( 'body' );
};

/**
 * Insert a buttons block with one nested button.
 *
 * @param {import('@wordpress/e2e-test-utils-playwright').Editor} editor
 */
const insertButtonBlock = async ( editor ) => {
	await editor.insertBlock( {
		name: 'core/buttons',
		innerBlocks: [
			{
				name: 'core/button',
				attributes: { text: 'Click me' },
			},
		],
	} );
};

test.describe( 'Blockparty Button Icon editor', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test( 'adds an icon to a core/button from the toolbar', async ( {
		editor,
		page,
	} ) => {
		await insertButtonBlock( editor );

		const canvas = await getEditorCanvas( page );
		const button = canvas.locator( '.wp-block-button' ).first();
		await expect( button ).toBeVisible( { timeout: 10_000 } );
		await button.click();

		const iconToolbarButton = page.getByLabel( 'Icon', { exact: true } );
		await expect( iconToolbarButton ).toBeEnabled( { timeout: 10_000 } );
		await iconToolbarButton.click();

		await expect( button ).toHaveClass( /blockparty-button-icon/ );
		await expect(
			canvas.locator( '.wp-block-button .wp-block-icon' ).first()
		).toBeVisible( { timeout: 10_000 } );

		await editor.saveDraft();
		await expect(
			page.getByRole( 'button', { name: 'Saved' } )
		).toBeVisible( { timeout: 15_000 } );
	} );

	test( 'removes nested icon blocks when the icon is disabled', async ( {
		editor,
		page,
	} ) => {
		await insertButtonBlock( editor );

		const canvas = await getEditorCanvas( page );
		const button = canvas.locator( '.wp-block-button' ).first();
		await expect( button ).toBeVisible( { timeout: 10_000 } );
		await button.click();

		await page.getByLabel( 'Icon', { exact: true } ).click();
		await expect(
			canvas.locator( '.wp-block-button .wp-block-icon' ).first()
		).toBeVisible( { timeout: 10_000 } );

		await page
			.getByRole( 'button', { name: 'Remove icon', exact: true } )
			.click();

		await expect( button ).not.toHaveClass( /blockparty-button-icon/ );
		await expect(
			canvas.locator( '.wp-block-button .wp-block-icon' )
		).toHaveCount( 0 );

		const buttonClientId = await canvas
			.locator( '[data-type="core/button"]' )
			.first()
			.getAttribute( 'data-block' );

		const nestedIconCount = await page.evaluate( ( clientId ) => {
			const { select } = window.wp.data;
			return select( 'core/block-editor' ).getBlocks( clientId ).length;
		}, buttonClientId );

		expect( nestedIconCount ).toBe( 0 );
	} );
} );
