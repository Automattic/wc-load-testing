/*jshint esversion: 6 */

const AddToCartTest = {

	runTest: async ( batchSize, batchCount ) => {
		const args = await AddToCartTest.setupRequest();

		const requestCompletionTime = [];
		let errorCount = 0;
		for( let ctr = 0; ctr < batchSize; ctr++ ) {
			let timeStart = Date.now();
			const requestPromise = AddToCartTest.generateTestRequest( args, batchCount ).then(
				() => {
					const timeEnd = Date.now();
					requestCompletionTime.push( timeEnd - timeStart );
				},
				() => {
					errorCount += 1;
				}
			);
			await requestPromise;
		}
		console.log("All request completed", requestCompletionTime );
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
			console.log( 'Starting test!' );
			const batchCount = document.getElementById(
				'wc-add-to-cart-number-of-batches' ).value || 10;
			const batchSize = document.getElementById(
				'wc-add-to-cart-batch-size' ).value || 5;
			const results = await AddToCartTest.runTest( batchSize,
				batchCount );
			console.log( 'Test completed, visualizing', results );
		} finally {
			startButton.classList.remove( 'disabled' );
		}
	};

};