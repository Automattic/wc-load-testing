/*jshint esversion: 6 */

const LoadTestManager = {

	startTest: async () => {
		const response = await LoadTestManager.setupRequest();
		console.log("Response: ", response);
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
	}


};

window.onload = () => {
	const startButton = document.getElementById( 'start_test' );

	startButton.onclick = () => {
		LoadTestManager.startTest();
	};

};