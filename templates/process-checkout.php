<div class="wc-test-process-checkout wc-load-test wc-load-test-container">
	<h3>Process checkout</h3>
	<p>Load tests process_checkout. This initializes a cart with one product and couple of coupons. Do not modify the cart for this user while the tests are runnning.</p>
	<div class="header-area">
		<table>
			<tr>
				<td>
					<label for="wc-test-process-checkout-batch-size">Batch size </label>
				</td>
				<td>
					<input id="wc-test-process-checkout-batch-size" type="number">
				</td>
			</tr>
			<tr>
				<td>
					<label for="wc-test-process-checkout-number-of-batches">Number of batches </label>
				</td>
				<td>
					<input id="wc-test-process-checkout-number-of-batches" type="number">
				</td>
			</tr>
		</table>
		<p>
			<div class="hidden wc-test-process-checkout-nonce">
			<?php
				wp_nonce_field( 'woocommerce-process_checkout', 'woocommerce-process-checkout-nonce' );
			?>
			</div>
			<input type="button" class="button button-primary test-submit process-checkout" name="process-checkout" value="Start">
		</p>
	</div>
	<div class="results">
		<canvas id="wc-test-process-checkout-results-graph"></canvas>
	</div>
</div>
