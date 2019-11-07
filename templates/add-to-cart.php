<div class="add-to-cart wc-load-test wc-load-test-container">
	<h3>Add to Cart</h3>
	<p>Emulate multiple add to cart requests. Carts will be emptied before every request, and a sample product will be added to it.</p>
	<div class="header-area">
		<table>
			<tr>
				<td>
					<label for="wc-add-to-cart-batch-size">Batch size </label>
				</td>
				<td>
					<input id="wc-add-to-cart-batch-size" type="number">
				</td>
			</tr>
			<tr>
				<td>
					<label for="wc-add-to-cart-number-of-batches">Number of batches </label>
				</td>
				<td>
					<input id="wc-add-to-cart-number-of-batches" type="number">
				</td>
			</tr>
		</table>
		<p>
		<input type="button" class="button button-primary test-submit add-to-cart" name="add-to-cart" value="Start">
		</p>
	</div>
	<div class="results">
		<svg class="wc-add-to-cart-results"></svg>
	</div>
</div>
