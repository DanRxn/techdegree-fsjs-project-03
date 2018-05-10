document.addEventListener('DOMContentLoaded', () => {  // Wrapping all logic in a function to remove it from global scope
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
			// Done in HTML

	// T-Shirt Section	
		// Hide “Color” drop down menu until a T-Shirt design is selected
	document.querySelector('#colors').style.display = 'none';
		// Adjust the color options when design is chosen
	document.querySelector('#design').addEventListener('change', () => {
		const theme = document.querySelector('#design').value;
		for (i = 0; i < document.querySelectorAll('#color option').length; i += 1) {
			var optValue = document.querySelectorAll('#color option')[i].textContent;
			optValue = optValue.replace(" (I ♥ JS shirt only)", "");
			optValue = optValue.replace(" (JS Puns shirt only)", "");
			document.querySelectorAll('#color option')[i].textContent = optValue;
		}
		switch(theme) {
			case "js puns":
				document.querySelector('#colors').style.display = '';
				document.querySelector('#i-heart-js-options').style.display = 'none';
				document.querySelector('#js-puns-options').style.display = 'initial';
				document.querySelector('#color').selectedIndex = '0';
				break;
			case "heart js":
				document.querySelector('#colors').style.display = '';
				document.querySelector('#js-puns-options').style.display = 'none';
				document.querySelector('#i-heart-js-options').style.display = 'initial';
				document.querySelector('#color').selectedIndex = '0';
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
			// CREATE array of objects from checkboxes on page
	const disableConflictingActivities = (activitiesHtml) => {
		const disableConflicts = (activitiesArray) => {
			let activities = activitiesArray;
			for (let i = 0; i < activities.length; i++) {
				switch (activities[i].checked) {
					case true: 
						activities[i].style.display = false;
						break;
					case false:
						for (let a = 0; a < activities.length; a++) {
							if (activities[i].dateTimes === activities[a].dateTimes && activities[a].checked) {
								activities[i].style.display = true;
								break;
							} else {
								activities[i].style.display = false;
							}
						}
				}
			}
			return activities;
		}
		const updateActivitiesHtml = (activitiesArray) => {
			for (i = 0; i < activitiesArray.length; i++) {
				const disabledState = activitiesArray[i].disabled;
				document.querySelectorAll('.activities > label')[i].querySelector('input').style.display = disabledState;
				document.querySelectorAll('.activities > label')[i].setAttribute("disabled", disabledState);
			}
		}
		const updatedActivities = disableConflicts(parseActivities(activitiesHtml));
		updateActivitiesHtml(updatedActivities);
	}

		// Total the cost of all events
	const createTotalDiv = () => {
		const totalBlockHtml = document.createElement('div');
		totalBlockHtml.innerHTML = `Total: <strong>$<span id="total-cost">0</span></strong>`;
		totalBlockHtml.className = 'total-block';
		document.querySelector('.activities').appendChild(totalBlockHtml);
			// Inserts `<div class="total-block">Total: <strong>$<span id="total-cost">0</span></strong></div>`	
	}

	const updateTotalDiv = () => {
		const calcTotalCost = () => {
			const allActivities = parseActivities(document.querySelectorAll('.activities > label'));
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
			document.querySelector('#total-cost').textContent = totalCost;
		}
		displayTotalCost(calcTotalCost());
	}

		// Listen for changes to checkboxes
		document.querySelector('.activities').addEventListener("change", () => {
			disableConflictingActivities(document.querySelectorAll('.activities > label'));
			let totalDiv = document.querySelector('#total-cost');
			switch (totalDiv !== null) {
				case true: 
					updateTotalDiv();
					break;
				case false:
					createTotalDiv();
					updateTotalDiv();
					break;
			}
		});

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

	// # Form validation
	const getValidityOfName = () => {
		let thisElement = document.querySelector('#name');
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
		let thisElement = document.querySelector('#mail');
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

		let thisElement = document.querySelector('.activities');
		let thisValid = false;
		let thisErrorMessage = "Please select at least one activity";
		let thisMessageDivId = "activities-error"
		const allActivities = parseActivities(document.querySelectorAll('.activities > label'));
		
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

		let thisElement = document.querySelector('#cc-num');
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
		let thisElement = document.querySelector('#zip');
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
		let thisElement = document.querySelector('#cvv');
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
			
			const createErrorDiv = () => {
				let newErrorDiv = document.createElement('div');
				newErrorDiv.id = errorDivId;
				newErrorDiv.classList.add('error-message');
				element.after(newErrorDiv);
			}
			const updateErrorDivTextContent = () => {
				document.querySelector(`#${errorDivId}`).textContent = userMessage;
			}

			switch (valid) {
				case true: 
					if (document.querySelector(`#${errorDivId}`)) {
						document.querySelector(`#${errorDivId}`).remove();
					}
					break;
				case false:
					if (document.querySelector(`#${errorDivId}`)) {
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
		
		if (document.querySelector('#payment').value === 'credit_card') {
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

	document.querySelector('#name').addEventListener("input", () => {
		updatePageForValidity(getValidityOfName());
	});
	document.querySelector('#mail').addEventListener("input", () => {
		updatePageForValidity(getValidityOfEmail());
	});
	document.querySelector('.activities').addEventListener("input", () => {
		updatePageForValidity(getValidityofActivities());
	});
	document.querySelector('#cc-num').addEventListener("input", () => {
		updatePageForValidity(getValidityOfCardNumber());
	});
	document.querySelector('#zip').addEventListener("input", () => {
		updatePageForValidity(getValidityOfZipCode());
	});
	document.querySelector('#cvv').addEventListener("input", () => {
		updatePageForValidity(getValidityOfCvv());
	});
	document.querySelector('#cvv').addEventListener("input", () => {
		updatePageForValidity(getValidityOfCvv());
	});

	document.querySelector('form').addEventListener("submit", (e) => {
		formValid = validateForm();
		if (formValid !== true) {
			e.preventDefault();
		} else {
			return true;
		}
	});

});