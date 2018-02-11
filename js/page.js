document.addEventListener('DOMContentLoaded', () => {


	document.querySelector('#design').addEventListener('change', () => {
		const theme = $('#design').val();
		for (i = 0; i < $('#color option').length; i += 1) {
			var optValue = document.querySelectorAll('#color option')[i].textContent;
			optValue = optValue.replace(" (I ♥ JS shirt only)", "");
			optValue = optValue.replace(" (JS Puns shirt only)", "");
			document.querySelectorAll('#color option')[i].textContent = optValue;
		}
		switch(theme) {
			case "js puns":
				$('#i-heart-js-options').hide();
				$('#js-puns-options').show();
				$('#color').prop('selectedIndex',0);
				break;
			case "heart js":
				$('#js-puns-options').hide();
				$('#i-heart-js-options').show();
				$('#color').prop('selectedIndex',0);
				break;
			default:
				console.log(`Error: Something went wrong when selecting a design (theme = ${theme}) `);
		}		
	});

	document.querySelector('#color').addEventListener('change', () => {
		const implicitTheme = $('#color option:selected').parent().attr('id');
		switch(implicitTheme) {
			case "js-puns-options":
				$("#design").val("js puns");
				break;
			case "i-heart-js-options":
				$("#design").val("heart js");
				break;
			default:
				console.log(`Error: Something when wrong when selecting a color (implicitTheme = ${implicitTheme}`);
		}
	});

});