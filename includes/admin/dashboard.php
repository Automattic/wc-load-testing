<?php
/** Plugin admin settings ...*/

namespace WC\LoadTesting\Admin;

foreach( glob( WC_LOAD_TEST_DIR . "/includes/test-classes/*.php" ) as $file ) {
	require_once $file;
}

/**
 * Class Scenarios
 * Initialize and manages the scenarios screen.
 *
 * @package WC\Cat\Admin
 */
class Dashboard {

	/**
	 * Set up hooks.
	 */
	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'register_admin_menu' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_scripts' ) );
	}

	public static function enqueue_scripts() {
		if ( 'tools_page_load-testing' === \get_current_screen()->id ) {
			wp_enqueue_script( 'load-testing-dashboard', plugins_url( '/assets/js/dashboard.js', WC_LOAD_TEST_PATH ) );
		}
	}

	/**
	 * Register admin menu and screen.
	 */
	public static function register_admin_menu() {
		$hook = add_management_page(
			'WooCommerce Load Testing',
			'WooCommerce Load Testing',
			'install_plugins',
			'load-testing',
			array( __CLASS__, 'render_load_testing_admin_page' )
		);
		add_action( "load-$hook", array( __CLASS__, 'load_testing_setup' ) );
		add_action( "load-$hook", array( __CLASS__, 'load_testing_exec' ) );
	}

	public static function render_load_testing_admin_page() {
		if ( ! empty( $_POST['test_slug'] ) ) {
			return;
		}
		wp_register_script( 'd3js', 'https://d3js.org/d3.v5.min.js', null, null, true );
		wp_enqueue_script('d3js');

		?>
		<h1>WooCommerce Load Testing</h1>
		<?php

		// All available load tests.
		\AddToCartLoadTest::render();
	}

	public static function load_testing_setup() {
		if ( empty( $_POST['test_slug'] ) || 'setup' !== $_POST['action'] ) {
			return;
		}

		$args = array();
		switch ( $_POST['test_slug'] ) {
			case 'add-to-cart':
				$args = \AddToCartLoadTest::setup();
		}
		wp_send_json( $args, 200 );
		die();
	}

	public static function load_testing_exec() {
		if ( empty( $_POST['test_slug'] ) || 'execute' !== $_POST['action'] ) {
			return;
		}

		switch ( $_POST['test_slug'] ) {
			case 'add-to-cart':
				\AddToCartLoadTest::add_simple_product_to_cart();
		}
		wp_send_json( array(), 200 );
	}

}