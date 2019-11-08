/*jshint esversion: 6 */

const RunLoadTest = {
	runTest: async ( args, batchSize, batchCount, batchCB ) => {
		const requestCompletionTime = [];
		let errorCount = 0;
		for( let ctr = 0; ctr < batchSize; ctr++ ) {
			let timeStart = Date.now();
			const requestPromise = RunLoadTest.generateTestRequest( args, batchCount ).then(
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

	createChart: ( id, label ) => {
		const ctx = document.getElementById( id ).getContext('2d');
		return new Chart( ctx, {
			type: 'line',
			data: {
				datasets: [ { data: [], fill: false, label: 'Time taken to complete whole batch (in ms)' } ],
			},
			options: {
				title: {
					display: true,
					text: label
				}
			}
		} );
	},

	updateChart: ( newResult, chart ) => {
		chart.data.datasets.forEach( ( dataset ) => {
			dataset.data.push( newResult );
		} );
		chart.data.labels.push( ( chart.data.labels.length || 0 ) + 1 );
		chart.update();
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
	},
};

const AddToCartTest = {

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

	startButtonHandler: async ( startButton ) => {
		startButton.classList.add( 'disabled' );
		try {
			const chart = RunLoadTest.createChart( 'wc-add-to-cart-results-graph', 'Add to cart load test' );
			const batches = document.getElementById(
				'wc-add-to-cart-number-of-batches' ).value || 10;
			const batchSize = document.getElementById(
				'wc-add-to-cart-batch-size' ).value || 5;
			const args = await AddToCartTest.setupRequest();
			await RunLoadTest.runTest(
				args,
				batches,
				batchSize,
				( newResult ) => {
					RunLoadTest.updateChart( newResult, chart );
				},
			);
		} finally {
			startButton.classList.remove( 'disabled' );
		}
	}
};

const ProcessCheckoutTest = {

	setupRequest: async () => {
		const formData = new FormData();
		formData.append( 'test_slug', 'process-checkout' );
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
		const responseData = await response.json();
		responseData['load-test-nonce'] = document.getElementById('woocommerce-process-checkout-nonce').value;
		return responseData;
	},

	startButtonHandler: async ( startButton ) => {
		startButton.classList.add( 'disabled' );
		try {
			const chart = RunLoadTest.createChart( 'wc-test-process-checkout-results-graph', 'Process checkout load test' );
			const batches = document.getElementById(
				'wc-test-process-checkout-number-of-batches' ).value || 10;
			const batchSize = document.getElementById(
				'wc-test-process-checkout-batch-size' ).value || 5;
			const args = await ProcessCheckoutTest.setupRequest();
			console.log("Received args: ", args);
			await RunLoadTest.runTest(
				args,
				batches,
				batchSize,
				( newResult ) => {
					RunLoadTest.updateChart( newResult, chart );
				},
			);
		} finally {
			startButton.classList.remove( 'disabled' );
		}
	}
};

window.onload = () => {
	const addToCartStartButton = document.getElementsByClassName( 'test-submit add-to-cart' )[0];

	addToCartStartButton.onclick = () => {
		AddToCartTest.startButtonHandler( addToCartStartButton );
	};

	const processCheckoutStartButton = document.getElementsByClassName( 'test-submit process-checkout' )[0];

	processCheckoutStartButton.onclick = () => {
		ProcessCheckoutTest.startButtonHandler( processCheckoutStartButton );
	}

};