<?php

/**
 * Plugin Name: WooCommerce Load Testing
 * Plugin URI: https://woocommerce.com/
 * Description: Simulates load testing from browser for common WooCommerce scenarios.
 * Version: 0.0.1
 * Author: Automattic
 * Author URI: https://woocommerce.com
 *
 * @package WooCommerce
 */


defined( 'ABSPATH' ) || exit;

if ( ! defined( 'WC_LOAD_TEST_PATH' ) ) {
	define( 'WC_LOAD_TEST_PATH', __FILE__ );
}

if ( ! defined( 'WC_LOAD_TEST_DIR' ) ) {
	define( 'WC_LOAD_TEST_DIR', __DIR__ );
}

require_once __DIR__ . '/includes/admin/dashboard.php';

function load_wc_load_tester() {
	\WC\LoadTesting\Admin\Dashboard::init();
}

if ( version_compare( PHP_VERSION, '5.3', '>' ) ) {
	add_action( 'plugins_loaded', 'load_wc_load_tester', 20 );
}
