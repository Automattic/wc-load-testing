<?php

require_once WC_LOAD_TEST_DIR . '/includes/abstract-load-test.php';

class AddToCartLoadTest extends LoadTest {

	public static function setup() {
		$product = new \WC_Product();
		$product->set_props(
			array(
				'name'           => 'Generated by Load testing ',
				'regular_price'  => 1,
				'sales_price'    => 2,
				'tax_status'     => 'taxable',
				'manage_stock'   => true,
				'stock_quantity' => 100000,
				'stock_status'   => 'instock',
			)
		);
		$product->save();
		return array(
			'product_id' => $product->get_id(),
			'quantity' => 1,
			'test_slug' => 'add-to-cart',
		);
	}

	public static function add_simple_product_to_cart() {
		$_REQUEST['add-to-cart'] = $_POST['product_id'];
		$_REQUEST['quantity'] = $_POST['quantity'];
		WC()->frontend_includes();
		wc_load_cart();
		WC_Form_Handler::add_to_cart_action();
	}

	public static function teardown( $product_id ) {
		$product = \WC_Product( $product_id );
		$product->delete( true );
	}

	public static function render() {
		require WC_LOAD_TEST_DIR . '/templates/add-to-cart.php';
	}
}
