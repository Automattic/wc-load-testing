/*jshint esversion: 6 */

const LoadTestManager = {

	runTest: async () => {
		const args = await LoadTestManager.setupRequest();

		const total = 10;
		const requestCompletionTime = [];
		let errorCount = 0;
		for( let ctr = 0; ctr < total; ctr++ ) {
			let timeStart = Date.now();
			const requestPromise = LoadTestManager.generateTestRequest( args, 2 ).then(
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

	generateTestRequest: ( args,  batchSize = 1 ) => {
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
		for( let i = 0; i < batchSize; i++ ) {
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
	const startButton = document.getElementsByClassName( 'start_test' );

	startButton.onclick = () => {
		console.log('Starting test!');
		const results = LoadTestManager.runTest();
		console.log('Test completed, visualizing');
	};

};