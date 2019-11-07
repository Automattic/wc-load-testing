/*jshint esversion: 6 */

const AddToCartTest = {

	runTest: async ( batchSize, batchCount, batchCB ) => {
		const args = await AddToCartTest.setupRequest();

		const requestCompletionTime = [];
		let errorCount = 0;
		for( let ctr = 0; ctr < batchSize; ctr++ ) {
			let timeStart = Date.now();
			const requestPromise = AddToCartTest.generateTestRequest( args, batchCount ).then(
				() => {
					const timeTaken = Date.now() - timeStart;
					requestCompletionTime.push( timeTaken );
					batchCB( timeTaken );
				},
				() => {
					errorCount += 1;
				}
			);
			await requestPromise;
		}
		return requestCompletionTime;
	},

	setupRequest: async () => {
		const formData = new FormData();
		formData.append( 'test_slug', 'add-to-cart' );
		formData.append( 'action', 'setup' );
		const response = await fetch( '',
			{
				method: 'POST',
				mode: 'same-origin',
				cache: 'no-cache',
				credentials: 'same-origin',
				body: formData,
			}
		);
		return await response.json();
	},

	generateTestRequest: ( args,  batchCount = 1 ) => {
		const formData = new FormData();
		const requests = [];
		for ( let key in args ) {
			if ( ! args.hasOwnProperty( key ) ) {
				continue;
			}
			formData.append( key, args[ key ] );
		}
		formData.append( 'test_slug', 'add-to-cart' );
		formData.append( 'action', 'execute' );
		for( let i = 0; i < batchCount; i++ ) {
			requests.push(
				fetch( '',
					{
						method : 'POST',
						mode : 'same-origin',
						cache : 'no-cache',
						credentials : 'same-origin',
						body : formData,
					},
				),
			);
		}
		return Promise.all( requests );
	}
};

window.onload = () => {
	const startButton = document.getElementsByClassName( 'test-submit add-to-cart' )[0];

	startButton.onclick = async () => {
		startButton.classList.add( 'disabled' );
		try {
			const ctx = document.getElementById('wc-add-to-cart-results-graph').getContext('2d');
			const chart = new Chart( ctx, {
				type: 'line',
				data: {
					datasets: [ { data: [], fill: false, label: 'Time taken to complete whole batch (in ms)' } ],
				},
				options: {
					title: {
						display: true,
						text: "Add to Cart test"
					}
				}
			} );
			let labelCount = 1;
			const batches = document.getElementById(
				'wc-add-to-cart-number-of-batches' ).value || 10;
			const batchSize = document.getElementById(
				'wc-add-to-cart-batch-size' ).value || 5;
			const results = await AddToCartTest.runTest(
				batches,
				batchSize,
				( newResult ) => {
					chart.data.labels.push( labelCount );
					labelCount += 1;
					chart.data.datasets.forEach( ( dataset ) => {
						dataset.data.push( newResult );
					} );
					chart.update();
				},
			);
		} finally {
			startButton.classList.remove( 'disabled' );
		}
	};

};