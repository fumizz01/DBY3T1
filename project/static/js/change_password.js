$(document).ready(function () {

    /* hide show password */
    $("body").on('click', '#eye-pass1', function() {
        $(this).toggleClass("bx-show bx-hide");
        var input = $("#change-password");
        if (input.attr("type") === "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });

    $("body").on('click', '#eye-pass2', function() {
        $(this).toggleClass("bx-show bx-hide");
        var input = $("#password_confirm");
        if (input.attr("type") === "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });

    /* show password strength */
    $('#password-strength-status').hide();
    $('.pswd_info').hide();
    $('#change-password').keyup(function(event) {
        var password = $('#change-password').val();
        checkPasswordStrength(password);
    });

    $( "#change-password-form" ).on( "submit", function(event) {
        event.preventDefault();
        if (validateInputs()) {
            console.log("s")
            // If all validations pass, send a POST request
            const formData = $("#change-password-form").serialize(); // Serialize the form data
            
            $.ajax({
                type: 'POST',
                url: '', // Replace with your server endpoint URL
                data: formData,
                success: function (response) {
                    // Handle the success response from the server
                    console.log(response);
                    alert('Form submitted successfully! Redirecting...');
                    window.location.href = '/login'; // Replace with the URL you want to redirect to
                },
                error: function (error) {
                    // Handle errors
                    console.error('Error submitting form:', error);
                    alert('Error submitting form. Please try again.');
                }
            });
        }
    });

    
    
});

/* password */
function checkPasswordStrength(password) {
    $('#password-strength-status').show();
	var number     = /([0-9])/;
	var upperCase  = /([A-Z])/;
	var lowerCase  = /([a-z])/;
	var specialCharacters = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/;
    
	var characters     = (password.length >= 8 && password.length <= 15 );
	var capitalletters = password.match(upperCase) ? 1 : 0;
	var loweletters    = password.match(lowerCase) ? 1 : 0;
	var numbers        = password.match(number) ? 1 : 0;
	var special        = password.match(specialCharacters) ? 1 : 0;
    
	this.update_info('length', password.length >= 8 && password.length <= 15);
    this.update_info('capital', capitalletters);
    this.update_info('small', loweletters);
    this.update_info('number', numbers);
    this.update_info('special', special);
    
	var total = characters + capitalletters + loweletters + numbers + special;
	this.password_meter(total);
}

function update_info(criterion, isValid) {
    var $passwordCriteria = $('#passwordCriterion').find('li[data-criterion="' + criterion + '"]');
    if (isValid) {
        $passwordCriteria.removeClass('invalid').addClass('valid');
    } else {
        $passwordCriteria.removeClass('valid').addClass('invalid');
    }
}

function password_meter(total) {
    var meter = $('#password-strength-status');
    meter.removeClass();
    if (total === 0) {
        $('.pswd_info').slideUp();
        meter.html('');
    } else if (total === 1) {
        $('.pswd_info').slideDown();
        meter.addClass('veryweak-password').html('very weak');
    } else if (total === 2) {
        $('.pswd_info').slideDown();
        meter.addClass('weak-password').html('weak');
    } else if (total === 3) {
        $('.pswd_info').slideDown();
        meter.addClass('medium-password').html('medium');
    } else if (total === 4) {
        $('.pswd_info').slideDown();
        meter.addClass('average-password').html('average');
    } else {
        $('.pswd_info').slideDown();
        meter.addClass('strong-password').html('strong');
    }
}

/* password */

/* validate Input */
function setError(element, message) {
    const inputControl = element.parent();
    const errorDisplay = inputControl.find('.error-message');
    
    errorDisplay.text(message);
    inputControl.addClass('error').removeClass('pass');
}
``
function setSuccess(element) {
    const inputControl = element.parent();
    const errorDisplay = inputControl.find('.error-message');
    
    errorDisplay.text('');
    inputControl.addClass('pass').removeClass('error');
}

function validateInputs() {
    var total = 0

    const passwordValue = $('#change-password').val();
    const password2Value = $('#password_confirm').val();
    
    if(passwordValue === '') {
        setError($('#change-password'), 'Password is required');
    } else if (passwordValue.length < 8) {
        setError($('#change-password'), 'Password must be at least 8 characters');
    } else {
        setSuccess($('#change-password'));
        total +=1;
    }
    
    if(password2Value === '') {
        setError($('#password_confirm'), 'Please confirm your password');
    } else if (password2Value !== passwordValue) {
        setError($('#password_confirm'), "Passwords don't match");
    } else {
        setSuccess($('#password_confirm'));
        total +=1;
    }
    
    if (total === 2){
        return true;
    }
}

/* validate Input */

