<?php
/**
 * Plugin bootstrap.
 *
 * @package Blockparty\ButtonIcon
 */

namespace Blockparty\ButtonIcon;

/**
 * Main plugin singleton (extension point for shared bootstrap).
 */
class Main {

	/**
	 * Singleton instance.
	 *
	 * @var self|null
	 */
	private static $instance = null;

	/**
	 * Returns the singleton instance.
	 *
	 * @return self
	 */
	public static function get_instance(): self {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		// Reserved for plugin-wide bootstrap when needed.
	}
}
