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

		await canvas
			.locator( '.wp-block-button .wp-block-icon' )
			.first()
			.click();
		await editor.openDocumentSettingsSidebar();
		await expect(
			page
				.locator( '.blockparty-button-icon-notice' )
				.getByText( 'Inside a button, this icon is decorative' )
		).toBeVisible();

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

	test( 'switches to icon only and edits the label from the sidebar', async ( {
		editor,
		page,
	} ) => {
		await insertButtonBlock( editor );

		const canvas = await getEditorCanvas( page );
		const button = canvas.locator( '.wp-block-button' ).first();
		await expect( button ).toBeVisible( { timeout: 10_000 } );
		await button.click();

		await page.getByLabel( 'Icon', { exact: true } ).click();
		await editor.openDocumentSettingsSidebar();
		await page.getByRole( 'radio', { name: 'Icon only' } ).click();

		await expect( button ).toHaveClass( /blockparty-button-icon--only/ );
		await expect( button.locator( '.wp-block-button__label' ) ).toHaveCount(
			1
		);

		const labelField = page.getByRole( 'textbox', {
			name: 'Label (screen readers)',
		} );
		await expect( labelField ).toHaveValue( 'Click me' );

		// Clicking the nested icon must keep core/button selected so the Icon
		// panel (and required screen-reader label) stay available.
		await canvas
			.locator( '.wp-block-button .wp-block-icon' )
			.first()
			.click();
		await expect( labelField ).toBeVisible();
		await expect(
			page.getByRole( 'button', { name: 'Replace Icon', exact: true } )
		).toBeVisible();

		const selectedBlockName = await page.evaluate( () => {
			const { select } = window.wp.data;
			return select( 'core/block-editor' ).getSelectedBlock()?.name;
		} );
		expect( selectedBlockName ).toBe( 'core/button' );

		await labelField.fill( '' );
		await expect(
			page
				.locator( '.components-notice' )
				.getByText(
					'A label is required for an icon-only button to be accessible.'
				)
		).toBeVisible();

		await labelField.fill( 'Next slide' );
		await expect(
			page
				.locator( '.components-notice' )
				.getByText(
					'A label is required for an icon-only button to be accessible.'
				)
		).toHaveCount( 0 );

		const [ buttonBlock ] = ( await editor.getBlocks() )[ 0 ].innerBlocks;
		expect( buttonBlock.attributes.iconPosition ).toBe( 'only' );
		expect( buttonBlock.attributes.text ).toBe( 'Next slide' );
	} );

	test( 'keeps v1.0.0 button markup valid', async ( { editor, page } ) => {
		const legacyMarkup = [
			'<!-- wp:buttons --><div class="wp-block-buttons">',
			'<!-- wp:button --><div class="wp-block-button"><a class="wp-block-button__link wp-element-button">No icon</a></div><!-- /wp:button -->',
			'<!-- wp:button {"hasIcon":true} --><div class="wp-block-button blockparty-button-icon blockparty-button-icon--left"><a class="wp-block-button__link wp-element-button"><!-- wp:icon {"icon":"core/arrow-right"} /--><span class="wp-block-button__label">Left</span></a></div><!-- /wp:button -->',
			'<!-- wp:button {"hasIcon":true,"iconPosition":"right"} --><div class="wp-block-button blockparty-button-icon blockparty-button-icon--right"><a class="wp-block-button__link wp-element-button"><!-- wp:icon {"icon":"core/arrow-right"} /--><span class="wp-block-button__label">Right</span></a></div><!-- /wp:button -->',
			'</div><!-- /wp:buttons -->',
		].join( '' );

		await editor.setContent( legacyMarkup );

		const invalidCount = await page.evaluate( () => {
			const { select } = window.wp.data;
			const walk = ( blocks ) =>
				blocks.reduce(
					( count, block ) =>
						count +
						( block.isValid ? 0 : 1 ) +
						walk( block.innerBlocks ),
					0
				);
			return walk( select( 'core/block-editor' ).getBlocks() );
		} );

		expect( invalidCount ).toBe( 0 );
	} );

	test( 'switches left, icon only and right across a reload without invalid blocks', async ( {
		admin,
		editor,
		page,
	} ) => {
		await insertButtonBlock( editor );

		const canvas = await getEditorCanvas( page );
		const button = canvas.locator( '.wp-block-button' ).first();
		await expect( button ).toBeVisible( { timeout: 10_000 } );
		await button.click();

		await page.getByLabel( 'Icon', { exact: true } ).click();
		await editor.openDocumentSettingsSidebar();
		await page.getByRole( 'radio', { name: 'Icon only' } ).click();
		await expect( button ).toHaveClass( /blockparty-button-icon--only/ );

		const postId = await editor.publishPost();
		await admin.editPost( postId );

		const countInvalid = () =>
			page.evaluate( () => {
				const { select } = window.wp.data;
				const walk = ( blocks ) =>
					blocks.reduce(
						( count, block ) =>
							count +
							( block.isValid ? 0 : 1 ) +
							walk( block.innerBlocks ),
						0
					);
				return walk( select( 'core/block-editor' ).getBlocks() );
			} );

		await expect
			.poll( async () => ( await editor.getBlocks() ).length )
			.toBeGreaterThan( 0 );
		expect( await countInvalid() ).toBe( 0 );

		const reloadedCanvas = await getEditorCanvas( page );
		const reloadedButton = reloadedCanvas
			.locator( '.wp-block-button' )
			.first();
		await expect( reloadedButton ).toHaveClass(
			/blockparty-button-icon--only/
		);
		await editor.selectBlocks( reloadedButton );
		await editor.openDocumentSettingsSidebar();
		await page.getByRole( 'radio', { name: 'Right' } ).click();
		await expect( reloadedButton ).toHaveClass(
			/blockparty-button-icon--right/
		);
		await expect(
			reloadedButton.locator( '.wp-block-button__label' )
		).toHaveText( 'Click me' );
		expect( await countInvalid() ).toBe( 0 );
	} );
} );
