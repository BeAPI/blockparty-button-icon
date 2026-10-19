<?php
/**
 * WordPress Playground bootstrap for Blockparty Button Icon.
 *
 * @package Blockparty\ButtonIcon
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$plugin_dir = WP_PLUGIN_DIR . '/blockparty-button-icon';

if ( ! is_readable( $plugin_dir . '/vendor/autoload.php' ) || ! is_readable( $plugin_dir . '/build/index.js' ) ) {
	echo 'Playground requires built assets and Composer vendor on the plugin branch (see playground/blueprint-preview).';
	return;
}

$content_file = $plugin_dir . '/.wordpress-org/blueprints/demo-page-content.html';
$page_content = is_readable( $content_file ) ? file_get_contents( $content_file ) : '';

if ( false === $page_content || '' === $page_content ) {
	echo 'Demo page content file missing.';
	return;
}

update_option( 'permalink_structure', '/%postname%/' );

$page_id = wp_insert_post(
	array(
		'post_title'   => 'Blockparty Button Icon',
		'post_name'    => 'blockparty-button-icon-demo',
		'post_content' => $page_content,
		'post_status'  => 'publish',
		'post_type'    => 'page',
	),
	true
);

if ( is_wp_error( $page_id ) ) {
	echo 'Failed to create demo page: ' . $page_id->get_error_message();
	return;
}

update_option( 'show_on_front', 'page' );
update_option( 'page_on_front', (int) $page_id );
flush_rewrite_rules( false );

echo 'Page created with ID: ' . (int) $page_id;
