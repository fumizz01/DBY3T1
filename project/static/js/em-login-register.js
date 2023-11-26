let result = true;

$(document).ready(function () {
    
    /* hide show password */
    $("body").on('click', '.password-validation', function() {
        $(this).toggleClass("bx-show bx-hide");
        var input = $(".password");
        if (input.attr("type") === "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });

    /* hide show confirmation password */
    $("body").on('click', '.password-confirmation-icon', function() {
        $(this).toggleClass("bx-show bx-hide");
        var input = $(".password-confirmation");
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

        const user_name = $('#user_name').val();
        const passwordValue = $('#register-password').val();
        const password2Value = $('#password_confirm').val();

        if (!validateInputs(user_name, passwordValue, password2Value)) {
            return
        } 
        validateDuplicateDataAndSubmitForm(user_name)
    });

/*     $( "#login-form" ).on( "submit", function(event) {
        event.preventDefault();

        const loginUserName = $('#login-user').val();
        const loginPassword = $('#login-password').val();

        $.ajax({                                        // call backend /customer/list
            url:  '/customer/detail' + loginUserName + '/' + loginPassword,
            type:  'GET',
            dataType:  'json',
            success: function  (all_data) {
                    
                    },
                    error: function (xhr, status, error) {
                        console.log(error)         // if something error, reset text box
                    },
                });
            
    }); */
    
    $("#birthday").change(function() {
        var date = new Date($('#birthday').val());
        var age = calculateAge(date);
        $('#age').val(age);
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

function isNumber(value) {
    return !isNaN(value) && typeof value === 'number';
}

function validateInputs(user_name, passwordValue, password2Value) {
    var total = 0
    
    if(user_name === '') {
        setError($('#user_name'), 'กรุณาระบุชื่อผู้ใช้');
    } else {
        setSuccess($('#user_name'));
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
    
    if (total == 3){
        return true;
    }
};

/* validate Input */
function validateDuplicateDataAndSubmitForm(id_number, emailValue, user_name) {

    
    $.ajax({                                        // call backend /customer/list
        url:  '/customer/list',
        type:  'get',
        dataType:  'json',
        success: function  (all_data) {
            var flag = 1;
            console.log(all_data);
            //console.log(all_data.user_info.length);
            for(let i = 0; i < all_data.user_info.length; i++) {
                let data = all_data.user_info[i];
                
                //console.log(data);

                console.log("check1");
                /* console.log(!(document.getElementById("id_number").parentElement.classList.contains('error'))); */
                if (data.identification_number == id_number && !(document.getElementById("id_number").parentElement.classList.contains('error'))) {        // check if important data is duplicate with the existing data in database
                    setError($('#id_number'), 'รหัสบัตรประชาชนซ้ำกับข้อมูลในระบบ');
                    console.log('error1');
                    flag = 0;
                } 
                /* else {
                    setSuccess($('#id_number'));
                } */
                
                console.log('check2');
                /* console.log(!(document.getElementById("email").parentElement.classList.contains('error'))); */
                if (data.email == emailValue && !(document.getElementById("email").parentElement.classList.contains('error'))){
                    setError($('#email'), 'อีเมลซ้ำกับข้อมูลในระบบ');
                    console.log('error2');
                    flag = 0;
                }
                /* else {
                    setSuccess($('#email'));
                } */
                
                console.log('check3');
                /* console.log(!(document.getElementById("user_name").parentElement.classList.contains('error'))); */
                if (data.username == user_name && !(document.getElementById("user_name").parentElement.classList.contains('error'))) {
                    setError($('#user_name'), 'ชื่อผู้ใช้ซ้ำกับข้อมูลในระบบ');
                    console.log('error3');
                    flag = 0;
                }
                /* else {
                    setSuccess($('#user_name'));
                } */

            };

            if (flag === 0) { //guard clause: if the error happen, don't run the code below
                return false;
            }
            // If all validations pass, send a POST request
            const formData = $("#register-form").serialize(); // Serialize the form data
            
            $.ajax({
                type: 'POST',
                url: 'customer/register', // Replace with your server endpoint URL
                data: formData,
                success: function (response) {
                    if (response.error) {                               // if backend return error message, log it
                        console.log(response.error);
                        alert('การสมัครใช้งานล้มเหลว');
                    } else {
                        console.log(response);
                        alert('Register successfully! Redirecting...');
                        window.location.href = '/home'; // Replace with the URL you want to redirect to
                    }                    
                },
            });
        },
        error: function (xhr, status, error) {
            console.log(error)         // if something error, reset text box
        }

    });
    if (result) {
        console.log('YAY');
        console.log(result);
        return true;
    }
    else {
        console.log('NOO');
        console.log(result);
        return false;
    }
};

function updateFlagTrue() {
    result = true
}

function updateFlagFalse() {
    result = false
}

function calculateAge(date) 
{
  const now = new Date();
  const diff = Math.abs(now - date);
  const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365)); 
  return age
};

document.addEventListener('DOMContentLoaded', function () {
    var birthdayInput = document.getElementById('birthday');
    var currentDate = new Date().toISOString().split('T')[0];

    birthdayInput.setAttribute('max', currentDate);
});