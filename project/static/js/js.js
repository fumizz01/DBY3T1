$(document).ready(function () {
    /* hide show password */
    $("body").on('click', '.eye-icon', function() {
        $(this).toggleClass("bx-show bx-hide");
        var input = $("#login-password");
        if (input.attr("type") === "password") {
          input.attr("type", "text");
        } else {
          input.attr("type", "password");
        }
      });
    $('.pswd_info').hide();
    $('#login-password').keyup(function(event) {
        var password = $('#login-password').val();
        checkPasswordStrength(password);
      });
        


});


/* password */
function checkPasswordStrength(password) {
	var number     = /([0-9])/;
	var upperCase  = /([A-Z])/;
	var lowerCase  = /([a-z])/;
	var specialCharacters = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/;

	var characters     = (password.length >= 6 && password.length <= 15 );
	var capitalletters = password.match(upperCase) ? 1 : 0;
	var loweletters    = password.match(lowerCase) ? 1 : 0;
	var numbers        = password.match(number) ? 1 : 0;
	var special        = password.match(specialCharacters) ? 1 : 0;

	this.update_info('length', password.length >= 6 && password.length <= 15);
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