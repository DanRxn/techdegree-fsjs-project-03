document.addEventListener('DOMContentLoaded', () => {  // Wrapping all logic in a function to remove it from global scope
	// Declaring variables for relevant DOM elements
	let form = document.querySelector('form');
		let nameInput = document.querySelector('#name');

		let emailInput = document.querySelector('#mail');
		
		let titleSelect = document.querySelector('#title');
		let otherTitleTextInput = document.querySelector('#other-title');
		
		let colorsDiv = document.querySelector('#colors');
			let designSelect = document.querySelector('#design');
			let colorSelect = document.querySelector('#color');
				let colorOptions = document.querySelectorAll('#color option');
					let iHeartJsOptions = document.querySelector('#i-heart-js-options');
					let jsPunsOptions = document.querySelector('#js-puns-options');
		
		let activitiesFieldset = document.querySelector('.activities');
		let activitiesLabels = document.querySelectorAll('.activities > label');
		
		let paymentSelect = document.querySelector('#payment');
			let creditCardOption = document.querySelector('#credit-card');
			let paypalOption = document.querySelector('#paypal');
			let bitcoinOption = document.querySelector('#bitcoin');
		let creditCardNumberInput	= document.querySelector('#cc-num');
		let zipCodeInput = document.querySelector('#zip');
		let cvvInput = document.querySelector('#cvv');
	
	

	// # Set focus on the first text field
		// Done in index.html, since it's not JS and is desired behavior regardless of JS enablement

	// # ”Job Role” section of the form:
		// A text field that will be revealed when the "Other" option is selected from the "Job Role" drop down menu.
	
	otherTitleTextInput.setAttribute('type', 'hidden');
	titleSelect.addEventListener('change', () => {
		switch(titleSelect.value) {
			case "other":
				otherTitleTextInput.setAttribute('type', 'text');
				break;
			default:
			otherTitleTextInput.setAttribute('type', 'hidden');
		}
	});
		// Give the field an id of “other-title,” and add the placeholder text of "Your Job Role" to the field.
			// Done in HTML

	// T-Shirt Section	
		// Hide “Color” drop down menu until a T-Shirt design is selected
	colorsDiv.style.display = 'none';
		// Adjust the color options when design is chosen
	designSelect.addEventListener('change', () => {
		const theme = designSelect.value;

		for (i = 0; i < colorOptions.length; i += 1) {
			var optValue = colorOptions[i].textContent;
			optValue = optValue.replace(" (I ♥ JS shirt only)", "");
			optValue = optValue.replace(" (JS Puns shirt only)", "");
			colorOptions[i].textContent = optValue;
		}

		switch(theme) {
			case "js puns":
				colorsDiv.style.display = '';
				iHeartJsOptions.disabled = true;
				jsPunsOptions.disabled = false;
				colorSelect.selectedIndex = '0';
				break;
			case "heart js":
				colorsDiv.style.display = '';
				jsPunsOptions.disabled = true;
				iHeartJsOptions.disabled = false;
				colorSelect.selectedIndex = '0';
				break;
			default:
				console.log(`Error: Something went wrong when selecting a design (theme = ${theme}) `);
		}		
	});

	// # ”Register for Activities” section of the form:
	const parseActivities = (activitiesHtml) => { // returns array of objects, `parsedActivities`
		const objectifyActivity = (activity, i) => { // returns object, thisActivity
			const activityText = activity.textContent;
			const thisIndex = i;
		
			const parseTitle = (activity) => {
				const title = activity.substr(0, activity.indexOf('\u2014')).trim();
				return title;
			}
		
			const parseDateTimes = (activity) => {
				const startIndex = activity.indexOf('\u2014') + 1;
				const endIndex = activity.indexOf(',');
				const dateLength = endIndex - startIndex;
				const dateTimes = activity.substr(startIndex, dateLength).trim();
				return dateTimes;
			}
		
			const parsePrice = (activity) => {
				const priceText = activity.substr(activity.indexOf('$') + 1);
				const price = parseInt(priceText);
				return price;
			}
		
			const thisTitle = parseTitle(activityText);
			const thisDateTimes = parseDateTimes(activityText);
			const thisPrice = parsePrice(activityText);
			const thisChecked = activity.querySelector('input').checked;
			const thisDisabled = activity.querySelector('input').disabled;

			const thisActivity = {
				index: thisIndex,
				title: thisTitle,
				dateTimes: thisDateTimes,
				price: thisPrice,
				checked: thisChecked,
				disabled: thisDisabled
			}
			return thisActivity; 
		}

		const arrayifyActivities = (html) => {
			let activitiesArray = [];
			for (let i=0; i < html.length; i++) {
				const activityObject	= objectifyActivity(html[i], i);
				activitiesArray.push(activityObject);
			}
			return activitiesArray;
		}

		const parsedActivities = arrayifyActivities(activitiesHtml);
		return parsedActivities;
	}
	
		// Disable conflicting events
	const disableConflictingActivities = (activitiesHtml) => {
			// CREATE array of objects from checkboxes on page
		const disableConflicts = (activitiesArray) => {
			let activities = activitiesArray;
			for (let i = 0; i < activities.length; i++) {
				switch (activities[i].checked) {
					case true: 
						activities[i].disabled = false;
						break;
					case false:
						for (let a = 0; a < activities.length; a++) {
							if (activities[i].dateTimes === activities[a].dateTimes && activities[a].checked) {
								activities[i].disabled = true;
								break;
							} else {
								activities[i].disabled = false;
							}
						}
				}
			}
			return activities;
		}
			// Update page HTML for Activities section, with disabled conflicts
		const updateActivitiesHtml = (activitiesArray) => {
			for (i = 0; i < activitiesArray.length; i++) {
				const label = activitiesLabels[i];
				const input = label.querySelector('input');
				const disabledState = activitiesArray[i].disabled;
				if (disabledState) {
					input.setAttribute('disabled', disabledState);
					label.setAttribute('disabled', disabledState);
				} else {
					input.removeAttribute('disabled');
					label.removeAttribute('disabled');
				}
			}
		}
		const updatedActivities = disableConflicts(parseActivities(activitiesHtml));
		updateActivitiesHtml(updatedActivities);
	}

		// Total the cost of all events
			// Create the Total section of page
	const createTotalDiv = () => {
		const totalBlockHtml = document.createElement('div');
		totalBlockHtml.innerHTML = `Total: <strong>$<span id="total-cost">0</span></strong>`;
		totalBlockHtml.className = 'total-block';
		activitiesFieldset.appendChild(totalBlockHtml);
			// Inserts `<div class="total-block">Total: <strong>$<span id="total-cost">0</span></strong></div>`	
	}
			// Update the total on the page, with the calculated total
	const updateTotalDiv = () => {
		const calcTotalCost = () => {
			const allActivities = parseActivities(activitiesLabels);
			let totalCost = 0;
			for (i = 0; i < allActivities.length; i++) {
				switch (allActivities[i].checked) {
					case true: 
						totalCost += allActivities[i].price;
						break;
					case false:
						break;
				}		
			}
			return totalCost;
		}
		const displayTotalCost = (totalCost) => {
			let totalCostSpan = document.querySelector('#total-cost');
			totalCostSpan.textContent = totalCost;
		}
		displayTotalCost(calcTotalCost());
	}

	// # Payment Info section of the form
		// Display payment sections based on the payment option chosen 
		// in the select menu
	const hideOtherPaymentMethods = (selectedMethod) => {
		switch(selectedMethod) {
			case "credit_card":
				creditCardOption.style.display = '';
				paypalOption.style.display = 'none';
				bitcoinOption.style.display = 'none';
				break;
			case "paypal":
				creditCardOption.style.display = 'none';
				paypalOption.style.display = '';
				bitcoinOption.style.display = 'none';
				break;
			case "bitcoin":
				creditCardOption.style.display = 'none';
				paypalOption.style.display = 'none';
				bitcoinOption.style.display = '';
				break;
			default:
				console.log(`Error: Something went wrong when selecting payment method (selectedMethod = ${selectedMethod}) `);
		}
	}

	const setDefaultPayment = () => {
		const defaultMethod = 'credit_card';
		paymentSelect.value = defaultMethod;
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
	paymentSelect.addEventListener("change", (e) => {
		if( !e ) e = window.event;
		const selectedMethod = e.target.value;
		hideOtherPaymentMethods(selectedMethod);
	});

	// # Form validation
	const getValidityOfName = () => {
		let thisElement = nameInput;
		let thisValid = false;
		let thisErrorMessage = "";
		let thisMessageDivId = "name-error"

		if (/[a-z]/.test(thisElement.value.toLowerCase())) {
			thisValid = true;
			thisErrorMessage = "";
		} else {
			thisValid = false;
			thisErrorMessage = "Please enter your name";
		}

		const thisValidity = {
			element: thisElement,
			valid: thisValid,
			errorMessage: thisErrorMessage,
			messageDivId: thisMessageDivId
		}
		return thisValidity; // Returns the validity object for Name
	}

	const getValidityOfEmail = () => {
		let thisElement = emailInput;
		let thisValid = false;
		let thisErrorMessage = "";
		let thisMessageDivId = "email-error"

		let emailAddressPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (/[a-z]/.test(thisElement.value.toLowerCase()) === false) {
			thisValid = false;
			thisErrorMessage = "Please enter your email address";
		} else if (emailAddressPattern.test(thisElement.value)) {
			thisValid = true;
			thisErrorMessage = "";
		} else {
			thisValid = false;
			thisErrorMessage = "Type your full email (e.g. jane@janedoe.org)";
		}

		const thisValidity = {
			element: thisElement,
			valid: thisValid,
			errorMessage: thisErrorMessage,
			messageDivId: thisMessageDivId
		}
		return thisValidity; // Returns the validity object for Email
	}

	const getValidityofActivities = () => {
		// Validate at least one checkbox is selected

		let thisElement = activitiesFieldset;
		let thisValid = false;
		let thisErrorMessage = "Please select at least one activity";
		let thisMessageDivId = "activities-error"
		const allActivities = parseActivities(activitiesLabels);
		
		for (i = 0; i < allActivities.length; i++) {
			switch (allActivities[i].checked) {
				case true: 
					thisValid = true;
					thisErrorMessage = "";
					break;
				case false:
					break;
			}		
		}

		const thisValidity = {
			element: thisElement,
			valid: thisValid,
			errorMessage: thisErrorMessage,
			messageDivId: thisMessageDivId
		}
		return thisValidity;  // Returns the validity object for Activities
	}

	const getValidityOfCardNumber = () => {

		let thisElement = creditCardNumberInput;
		let thisValid = false;
		let thisErrorMessage = "";
		let thisMessageDivId = "cc-num-error"

		let ccNumberPattern = /^[0-9]{13,16}$/;

		// Not blank
		// Numbers only
		// 13 to 16 digits
		if (/[0-9]/.test(thisElement.value.toLowerCase()) === false) {
			thisValid = false;
			thisErrorMessage = "Please enter your card number";
		} else if (ccNumberPattern.test(thisElement.value)) {
			thisValid = true;
			thisErrorMessage = "";
		} else {
			thisValid = false;
			thisErrorMessage = "Your card number should be between 13–16 digits (no dashes or spaces)";
		}

		const thisValidity = {
			element: thisElement,
			valid: thisValid,
			errorMessage: thisErrorMessage,
			messageDivId: thisMessageDivId
		}
		return thisValidity;  // Returns the validity object for Card Number
	}

	const getValidityOfZipCode = () => {
		let thisElement = zipCodeInput;
		let thisValid = false;
		let thisErrorMessage = "";
		let thisMessageDivId = "zip-error"

		let zipPattern = /^[0-9]{5,5}$/;

		// Not blank
		// Numbers only
		// 5 digits
		if (/[0-9]/.test(thisElement.value.toLowerCase()) === false) {
			thisValid = false;
			thisErrorMessage = "Please enter your zip code";
		} else if (zipPattern.test(thisElement.value)) {
			thisValid = true;
			thisErrorMessage = "";
		} else {
			thisValid = false;
			thisErrorMessage = "Your zip code should be 5 digits (no letters, dashes, or spaces)";
		}

		const thisValidity = {
			element: thisElement,
			valid: thisValid,
			errorMessage: thisErrorMessage,
			messageDivId: thisMessageDivId
		}
		return thisValidity;  // Returns the validity object for Zip Code
	}

	const getValidityOfCvv = () => {
		let thisElement = cvvInput;
		let thisValid = false;
		let thisErrorMessage = "";
		let thisMessageDivId = "cvv-error"

		let cvvPattern = /^[0-9]{3,3}$/;

		// Not blank
		// Numbers only
		// 3 digits
		if (/[0-9]/.test(thisElement.value.toLowerCase()) === false) {
			thisValid = false;
			thisErrorMessage = "Please enter your card's CVV (back of card)";
		} else if (cvvPattern.test(thisElement.value)) {
			thisValid = true;
			thisErrorMessage = "";
		} else {
			thisValid = false;
			thisErrorMessage = "Your card's CVV should be 3 digits (no letters, dashes, or spaces)";
		}

		const thisValidity = {
			element: thisElement,
			valid: thisValid,
			errorMessage: thisErrorMessage,
			messageDivId: thisMessageDivId
		}
		return thisValidity;  // Returns the validity object for CVV
	}

	const updatePageForValidity = (elementValidity) => {
		const element = elementValidity.element;
		const valid = elementValidity.valid;
		const userMessage = elementValidity.errorMessage;
		const errorDivId = elementValidity.messageDivId;

		const setClassForValidity = () => {
			switch (valid) {
				case true: 
					element.classList.add('valid');
					element.classList.remove('invalid');
					break;
				case false:
					element.classList.add('invalid');
					element.classList.remove('valid');
			}
		}
		const updateErrorMessageForValidity = () => {
			// e.g. `<div id="name-error" class="error-message"> Please enter your name </div>`
			let preexistingErrorDiv = document.querySelector(`#${errorDivId}`);

			const createErrorDiv = () => {
				let newErrorDiv = document.createElement('div');
				newErrorDiv.id = errorDivId;
				newErrorDiv.classList.add('error-message');
				element.after(newErrorDiv);
			}
			const updateErrorDivTextContent = () => {
				let errorDivToUpdate = document.querySelector(`#${errorDivId}`);
				errorDivToUpdate.textContent = userMessage;
			}

			switch (valid) {
				case true: 
					if (preexistingErrorDiv) {
						preexistingErrorDiv.remove();
					}
					break;
				case false:
					if (preexistingErrorDiv) {
						updateErrorDivTextContent();
					} else {
						createErrorDiv();
						updateErrorDivTextContent();
					}
					break;
			}
		}
		setClassForValidity();
		updateErrorMessageForValidity();
	}
	
		// Validate full form
	const validateForm = () => {
		const nameValidity = getValidityOfName();
		const emailValidity = getValidityOfEmail();
		const activitiesValidity = getValidityofActivities();
		// Optional (only if Credit Card is selected payment method)
		let cardNumberValidity = {};
		let zipCodeValidity = {};
		let cvvValidity = {};
		
		if (paymentSelect.value === 'credit_card') {
		cardNumberValidity = getValidityOfCardNumber();
		zipCodeValidity = getValidityOfZipCode();
		cvvValidity = getValidityOfCvv();
		}

		const pageValidity = [nameValidity, emailValidity, activitiesValidity, cardNumberValidity, zipCodeValidity, cvvValidity];
		let formValid = true;

			// Test if all are valid; if yes, return TRUE; if not, return FALSE
		
		for (i = 0; i < pageValidity.length; i++) {
			updatePageForValidity(pageValidity[i]);
			const fieldValid = pageValidity[i].valid;
			switch (fieldValid) {
				case true: 
					break;
				case false: 
					formValid = false;
					break;
			}
		}
		return formValid;
	}

		// Listeners for each field

	nameInput.addEventListener("input", () => {
		updatePageForValidity(getValidityOfName());
	});
	emailInput.addEventListener("input", () => {
		updatePageForValidity(getValidityOfEmail());
	});
	activitiesFieldset.addEventListener("change", () => {
		let totalDiv = document.querySelector('.total-block');	
		switch (totalDiv !== null) {
			case true: 
				updateTotalDiv();
				break;
			case false:
				createTotalDiv();
				updateTotalDiv();
				break;
		}
		disableConflictingActivities(activitiesLabels);
		updatePageForValidity(getValidityofActivities());
	});
	creditCardNumberInput.addEventListener("input", () => {
		updatePageForValidity(getValidityOfCardNumber());
	});
	zipCodeInput.addEventListener("input", () => {
		updatePageForValidity(getValidityOfZipCode());
	});
	cvvInput.addEventListener("input", () => {
		updatePageForValidity(getValidityOfCvv());
	});

	form.addEventListener("submit", (e) => {
		formValid = validateForm();
		if (formValid !== true) {
			e.preventDefault();
		} else {
			return true;
		}
	});

});