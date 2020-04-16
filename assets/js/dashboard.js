/*jshint esversion: 6 */

const RunLoadTest = {
	runTest: async ( args, startStep, endStep, batchCB ) => {
		const requestCompletionTime = [];
		const failedRequests = [];
		let errorCount = 0;
		for( let ctr = parseInt( startStep ); ctr <= parseInt( endStep ); ctr++ ) {
			//3 iterations per step.
			for ( let itr = 0; itr < 3; itr++ ) {
				let timeStart = Date.now();
				const requestPromise = RunLoadTest.generateTestRequest( args,
					ctr ).then(
					( responses ) => {
						let failedReqCount = 0;
						responses.forEach( ( response ) => {
							console.log( response );
							if ( 'success' !== response.result ) {
								console.log( 'Error: ', response.status );
								failedReqCount++;
							}
						} );
						const timeTaken = Date.now() - timeStart;
						requestCompletionTime.push( timeTaken );
						const failedReqPercent = failedReqCount / ctr * 100;
						failedRequests.push( failedReqPercent );
						batchCB( timeTaken, failedReqPercent, ctr, itr );
					},
					() => {
						errorCount += 1;
					}
				);
				await requestPromise;
			}
		}
		return [ requestCompletionTime, failedRequests ];
	},

	createChart: ( id, label ) => {
		const ctx = document.getElementById( id ).getContext('2d');
		return new Chart( ctx, {
			type: 'line',
			data: {
				datasets: [
					{
						data: [],
						fill: false,
						label: 'Time taken to complete whole batch (s)',
						borderColor: 'rgb(33,255,64)',
					},
					{
						data: [],
						fill: false,
						label: 'Apparent throughput (rq/m)',
						borderColor: 'rgb(255, 92, 232)',
					},
					{
						data: [],
						fill: false,
						label: 'Failed request percent (%)',
						borderColor: "rgb(255, 0, 0)",
					}
				]
			},
			options: {
				title: {
					display: true,
					text: label
				},
			}
		} );
	},

	updateChart: ( newResult, failedReqPercent, batchSize, batchCount, chart ) => {
		chart.data.datasets[0].data.push( newResult / 1000 );
		chart.data.datasets[1].data.push( batchSize * 1000 * 60 / newResult );
		chart.data.datasets[2].data.push( failedReqPercent );
		chart.data.labels.push( "Batch-" + batchSize + "." + ( batchCount + 1 ) );
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
		const requestTime = [];
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
				).then( async ( response ) => {
					return await response.json();
				}),
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
			const startStep = document.getElementById(
				'wc-add-to-cart-number-of-batches' ).value || 1;
			const endStep = document.getElementById(
				'wc-add-to-cart-batch-size' ).value || 5;
			const args = await AddToCartTest.setupRequest();
			const results = await RunLoadTest.runTest(
				args,
				parseInt( startStep ),
				parseInt( endStep ),
				( newResult, failedReqPercent, batchSize, batchCount ) => {
					RunLoadTest.updateChart( newResult, failedReqPercent, batchSize, batchCount, chart );
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
		const stockQuantity = document.getElementById( 'wc-test-process-checkout-stock-quantity' ).value;
		formData.append( 'stock_quantity', stockQuantity );
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
			const startStep = document.getElementById(
				'wc-test-process-checkout-number-of-batches' ).value || 10;
			const endStep = document.getElementById(
				'wc-test-process-checkout-batch-size' ).value || 5;
			const args = await ProcessCheckoutTest.setupRequest();
			const results = await RunLoadTest.runTest(
				args,
				startStep,
				endStep,
				( newResult, failedReqPercent, batchSize, batchCount ) => {
					RunLoadTest.updateChart( newResult, failedReqPercent, batchSize, batchCount, chart );
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