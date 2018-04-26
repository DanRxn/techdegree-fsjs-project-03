document.addEventListener('DOMContentLoaded', () => {


	const activitiesCheckboxes = document.querySelectorAll('.activities label input');

	// # Set focus on the first text field
		// Done in index.html, since it's not JS and is desired behavior regardless of JS enablement

	// # ”Job Role” section of the form:
		// A text field that will be revealed when the "Other" option is selected from the "Job Role" drop down menu.
	document.querySelector('#other-title').setAttribute('type', 'hidden');
	document.querySelector('#title').addEventListener('change', () => {
		const title = document.querySelector('#title').value;
		switch(title) {
			case "other":
				document.querySelector('#other-title').setAttribute('type', 'text');
				break;
			default:
			document.querySelector('#other-title').setAttribute('type', 'hidden');
		}
	});
		// Give the field an id of “other-title,” and add the placeholder text of "Your Job Role" to the field.
			// 👆 Done in HTML

	// T-Shirt Section	
		// Hide “Color” drop down menu until a T-Shirt design is selected
	document.querySelector('#colors').style.display = 'none';
		// Adjust the color options when design is chosen
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
				document.querySelector('#colors').style.display = '';
				$('#i-heart-js-options').hide();
				$('#js-puns-options').show();
				$('#color').prop('selectedIndex',0);
				break;
			case "heart js":
				document.querySelector('#colors').style.display = '';
				$('#js-puns-options').hide();
				$('#i-heart-js-options').show();
				$('#color').prop('selectedIndex',0);
				break;
			default:
				console.log(`Error: Something went wrong when selecting a design (theme = ${theme}) `);
		}		
	});


	// Auto-select the design, if a color option is chosen first
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




	// # ”Register for Activities” section of the form:

		// Disable conflicting events

			// CREATE array of objects from checkboxes on page
	const arrayifyCheckboxs = (checkboxesHtml) => {
		const parseActivity = (activity, i) => {
			const activityText = activity.textContent;
			const thisIndex = i;
			const thisTitle = activityText.substr(0, activity.indexOf('—'));
			const thisDateTime = activityText.substr(activityText.indexOf('–'), activityText.indexOf(','));
			const thisPriceText = activityText.substr()
			const thisPrice = parseInt(thisPriceText);

			const thisActivity = {
				index: thisIndex,
				title: thisTitle,
				dateTimes: thisDateTimes,
				price: thisPrice
			}
			return thisActivity;
		}


		// todo
	}
			// UPDATE array of checkboxes with display state
	const updateArrayDisplayFlags = () => {
		// todo
	}
			// 
		
		// Total the cost of all events


	// # Payment Info section of the form

		// Display payment sections based on the payment option chosen 
		// in the select menu

	const hideOtherPaymentMethods = (selectedMethod) => {
		switch(selectedMethod) {
			case "credit_card":
				document.querySelector('#credit-card').style.display = '';
				document.querySelector('#paypal').style.display = 'none';
				document.querySelector('#bitcoin').style.display = 'none';
				break;
			case "paypal":
			document.querySelector('#credit-card').style.display = 'none';
			document.querySelector('#paypal').style.display = '';
			document.querySelector('#bitcoin').style.display = 'none';
				break;
			case "bitcoin":
			document.querySelector('#credit-card').style.display = 'none';
			document.querySelector('#paypal').style.display = 'none';
			document.querySelector('#bitcoin').style.display = '';
				break;
			default:
				console.log(`Error: Something went wrong when selecting payment method (selectedMethod = ${selectedMethod}) `);
		}
	}

	const setDefaultPayment = () => {
		const defaultMethod = 'credit_card';
		document.querySelector('#payment').value = defaultMethod;
		hideOtherPaymentMethods(defaultMethod);
	}


		// The "Credit Card" payment option should be selected by default, 
		// display the #credit-card div, and hide the "Paypal" and "Bitcoin information.
	setDefaultPayment();
	
		// When a user selects the "PayPal" payment option, the Paypal information 
		// should display, and the credit card and “Bitcoin” information should be hidden.
		
		// AND/OR

		// When a user selects the "Bitcoin" payment option, the Bitcoin information 
		// should display, and the credit card and “PayPal” information should be hidden.
	document.querySelector('#payment').addEventListener("change", () => {
		const selectedMethod = event.target.value;
		hideOtherPaymentMethods(selectedMethod);
	});




});