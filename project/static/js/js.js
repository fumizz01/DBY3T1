$(document).ready(function () {
    
    /* hide show password */
    $("body").on('click', '.eye-icon', function() {
        $(this).toggleClass("bx-show bx-hide");
        var input = $(".password");
        if (input.attr("type") === "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });
    
    /* show password strength */
    $('#password-strength-status').hide();
    $('.pswd_info').hide();
    $('#register-password').keyup(function(event) {
        var password = $('#register-password').val();
        checkPasswordStrength(password);
    });
    
    /*     $('#register-password, #password_confirm').on('keyup', function () {
        if ($('#register-password').val() == $('#password_confirm').val()) {
            $('#message').html('Matching').css('color', 'green');
            document.getElementById('register-button').disabled = false;
        } else {
            if  ($('#register-password').val() != ''){
                $('#message').html('Not Matching').css('color', 'red');
            }
            console.log($('#message').html())
            var para = document.createElement("p");
            if ($('#message').html() == 'Not Matching'){
                $("#register-button").click(function()
                {
                    $('#register-button').css('border', '1px solid red');
                    para.innerHTML = "You need to correctly confirm password";
                    para.style.cssText ='position:absolute; text-align:center; color:red; margin-top:35px; margin-left: 3%; display: inline-block;';
                    document.getElementById('register-button').disabled = true;
                });
            };
            
        };
        document.getElementById('message').appendChild(para);
    }); */
    
    /* $('#register-form').submit(function(e) {
        e.preventDefault();
        validateInputs();
        return true
    }); */
    $( "#register-form" ).on( "submit", function(event) {
        event.preventDefault();
        if (validateInputs()) {
            // If all validations pass, send a POST request
            const formData = $("#register-form").serialize(); // Serialize the form data
            
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

function setSuccess(element) {
    const inputControl = element.parent();
    const errorDisplay = inputControl.find('.error-message');
    
    errorDisplay.text('');
    inputControl.addClass('pass').removeClass('error');
}

function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function isNumber(value) {
    return !isNaN(value) && typeof value === 'number';
}

function validateInputs() {
    var total = 0
    const firstValue = $('#firstname').val();
    const lastnameValue = $('#lastname').val();
    const dateValue = $('#birthday').val();
    const tel = $('#tol').val();
    const id_number = $('#id_number').val();
    
    const emailValue = $('#email').val();
    const passwordValue = $('#register-password').val();
    const password2Value = $('#password_confirm').val();
    
    if(firstValue === '') {
        setError($('#firstname'), 'กรุณาระบุชื่อ');
    } else {
        setSuccess($('#firstname'));
        total +=1;
    }
    
    if(lastnameValue === '') {
        setError($('#lastname'), 'กรุณาระบุนามสกุล');
    } else {
        setSuccess($('#lastname'));
        total +=1;
    }
    
    if(dateValue === '') {
        setError($('#birthday'), 'กรุณาระบุวันเกิด');
    } else {
        setSuccess($('#birthday'));
        total +=1;
    }
    
    if(tel === '') {
        setError($('#tol'), 'กรุณาระบุเบอร์โทร');
    }  
    else if (!isNumber(Number(tel))){
        setError($('#tol'), 'กรุณากรอกเฉพาะตัวเลข');
    } 
    else if (tel.length < 8) {
        setError($('#tol'), 'must be at least 10 characters');
    }
    else {
        setSuccess($('#tol'));
        total +=1;
    }
    
    if(id_number === '') {
        setError($('#id_number'), 'กรุณาระบุรหัสบัตรประชาชน');
    }  
    else if (!isNumber(Number(id_number))){
        setError($('#id_number'), 'กรุณากรอกเฉพาะตัวเลข');
    }
    else if (id_number.length < 8) {
        setError($('#id_number'), 'must be at least 13 characters');
    }
    else {
        setSuccess($('#id_number'));
        total +=1;
    }
    
    if(emailValue === '') {
        setError($('#email'), 'กรุณาระบุอีเมลล์');
    } else if (!isValidEmail(emailValue)) {
        setError($('#email'), 'กรุณากรอกรูปแบบ อีเมลล์ ให้ถูกต้อง');
    } else {
        setSuccess($('#email'));
        total +=1;
    }
    
    if(passwordValue === '') {
        setError($('#register-password'), 'Password is required');
    } else if (passwordValue.length < 8) {
        setError($('#register-password'), 'Password must be at least 8 characters');
    } else {
        setSuccess($('#register-password'));
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
    
    if (total === 8){
        return true;
    }
}

/* validate Input */

document.addEventListener('DOMContentLoaded', function () {
    var birthdayInput = document.getElementById('birthday');
    var currentDate = new Date().toISOString().split('T')[0];

    birthdayInput.setAttribute('max', currentDate);
});

document.addEventListener('DOMContentLoaded', function () {
    // ดึงค่าจาก URL parameters
    var urlParams = new URLSearchParams(window.location.search);
    var checkinDate = urlParams.get('checkin');
    var checkoutDate = urlParams.get('checkout');
    var adult = urlParams.get('adult');
    var child = urlParams.get('child');

    var [year_in, month_in, day_in] = checkinDate.split('-');
    var [year_out, month_out, day_out] = checkoutDate.split('-');

    // แสดงค่าใน element
    document.getElementById('2bed-checkin-dateDD').innerText = day_in;
    document.getElementById('2bed-checkin-dateMM').innerText = month_in;
    document.getElementById('2bed-checkin-dateYYYY').innerText = year_in;

    document.getElementById('2bed-checkout-dateDD').innerText = day_out;
    document.getElementById('2bed-checkout-dateMM').innerText = month_out;
    document.getElementById('2bed-checkout-dateYYYY').innerText = year_out;

    document.getElementById('1bed-checkin-dateDD').innerText = day_in;
    document.getElementById('1bed-checkin-dateMM').innerText = month_in;
    document.getElementById('1bed-checkin-dateYYYY').innerText = year_in;

    document.getElementById('1bed-checkout-dateDD').innerText = day_out;
    document.getElementById('1bed-checkout-dateMM').innerText = month_out;
    document.getElementById('1bed-checkout-dateYYYY').innerText = year_out;

    document.getElementById('reserve-value-adult').innerText  = adult;
    document.getElementById('reserve-value-child').innerText  = child;

    console.log('Check-in Date:', typeof checkinDate);
    console.log('Check-out Date:', checkoutDate);
    console.log('Adult:', adult);
    console.log('Child:', child);
});


function updateValue(elementId, increment) {
    let MyElement = document.getElementById(elementId);
    let min = parseInt(MyElement.getAttribute("min"));
    let max = parseInt(MyElement.getAttribute("max"));
    let val = parseInt(MyElement.innerHTML);

    let newValue = val + increment;

    if (newValue >= min && newValue <= max) {
        MyElement.innerHTML = newValue;
    }
}