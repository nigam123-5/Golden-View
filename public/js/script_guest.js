function key_function(){
    let key1 = document.getElementById('key1');
    let key2 = document.getElementById('key2');
    let para1 = document.getElementById('para1');
    let para2 = document.getElementById('para2');

    if (key1.className === 'inactive'){
        key1.className = 'active';
        key2.className = 'inactive';
        key1.style.borderRadius = '5px 0 0 5px';
        para2.style.display = 'none';
        para1.style.display = 'block';
    }
    else{
        key2.className = 'active';
        key1.className = 'inactive';
        key2.style.borderRadius = '0 5px 5px 0';
        para1.style.display = 'none';
        para2.style.display = 'block';
    }
}


let errorBox = document.querySelector('.error-box');
let firstName = document.getElementById('first-name');
let country = document.getElementById('country');
let zipCode = document.getElementById('zip-code');
let address = document.getElementById('address');
let lastName = document.getElementById('last-name');
let form = document.getElementById('form');
let mobile = document.getElementById('mobile');
let email = document.getElementById('email');
let locate = document.getElementById('mark');
let box = document.getElementById('error');
let expiryDate = document.getElementById('expiry-date');
let code = document.getElementById('security-code');
let holder = document.getElementById('holder');
let card = document.getElementById('card-number');

form.addEventListener('submit', e =>{
    e.preventDefault();
    if (validateInput()){
        form.submit();
    };
});

form.addEventListener('input', function(event) {
    // Check if the event target is an input field
    let fieldName = event.target;
    // Extract the field name from the input ID
    const inputControl = fieldName.parentElement;

    if (fieldName.type === 'checkbox'){
        let id = fieldName.id;
        const errorDisplay = inputControl.querySelector('#error');
        if (id.checked){
            errorDisplay.innerHTML = '';
        }
    }
    else if (fieldName.classList.contains('card-input')){
        const errorDisplay = inputControl.nextElementSibling;
        errorDisplay.textContent = '';
        errorDisplay.classList.remove('error-success');
    }
    else if (fieldName.tagName === 'INPUT') {
        
        // Remove 'Error' from the field name to get the corresponding error element ID
        const errorDisplay = inputControl.querySelector('.error-box');
        // Clear the error message for the corresponding field
        errorDisplay.textContent = '';
        errorDisplay.classList.remove('error-success');
    }
    fieldName.style.border = '';
    fieldName.style.outline = '';
});

function setMessage(element, message){
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error-box');
    errorDisplay.innerHTML = message;
    errorDisplay.classList.add('error-success');
    element.style.border = '2px solid rgb(174, 7, 7)';
    element.style.outline = 'none';
    return false;
}

function validateInput(){
    let boolean = true;
    let mobileValue = mobile.value.trim();

    if (firstName.value.trim() === ""){
        boolean = setMessage(firstName, 'First Name is required');
    }
    if (lastName.value.trim() === ""){
        boolean = setMessage(lastName, 'Last Name is required');
    }
    if (country.value.trim() === ""){
        boolean = setMessage(country, 'Country is required');
    }
    if (address.value.trim() === ""){
        boolean = setMessage(address, 'Address 1 is required');
    }
    if (zipCode.value.trim() === ""){
        boolean = setMessage(zipCode, 'Postal/ Zip Code is required');
    }
    if (mobileValue === ""){
        boolean = setMessage(mobile, 'Mobile Number is required');
    }
    else{
        if (mobileValue.length !== 10){
            boolean = setMessage(mobile, 'Enter valid number');
        }
    }
    if (email.value.trim() === ""){
        boolean = setMessage(email, 'Email is required');
    }
    if (!locate.checked){
        box.innerHTML = 'Please agree to the privacy policy';
        boolean = false;
    }
    if (code.value.trim() === ""){
        boolean = setMessage(code, 'Security Code is required');
    }
    if (holder.value.trim() === ""){
        boolean = setMessage(holder, 'Cardholder Name is required');
    }
    if (expiryDate.value.trim() === ""){
        boolean = setMessage(expiryDate, 'Expiration Date is required');
    }
    if (card.value.trim() === ""){
       
        const errorDisplay = card.parentElement.nextElementSibling
        errorDisplay.innerHTML = 'Card Number is required';
        errorDisplay.classList.add('error-success');
        card.style.border = '2px solid rgb(174, 7, 7)';
        card.style.outline = 'none';
        boolean = false;
    }
    return boolean;
}

locate.addEventListener("change", function (){
    if (locate.checked) {
        box.innerHTML = '';
    }
})