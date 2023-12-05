$(document).ready(function () {
  /* ซ่อน,แสดง password */
  $("body").on("click", "#eye_pass1", function () {
    $(this).toggleClass("bx-show bx-hide");
    var input = $("#change_password");
    if (input.attr("type") === "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  });

  $("body").on("click", "#eye_pass2", function () {
    $(this).toggleClass("bx-show bx-hide");
    var input = $("#password_confirm");
    if (input.attr("type") === "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  });

  /* แสดง password strength */
  $("#password_strength_status").hide();
  $(".pswd_info").hide();
  $("#change_password").keyup(function (event) {
    var password = $("#change_password").val();
    validate_password(password);
  });

  $("#change_password_form").on("submit", function (event) {
    event.preventDefault();
    if (prevent_default_inputs()) {
      console.log("s");
      // If all validations pass, send a POST request
      const formData = $("#change_password_form").serialize(); // Serialize the form data

      $.ajax({
        type: "POST",
        url: "", // Replace with your server endpoint URL
        data: formData,
        success: function (response) {
          // Handle the success response from the server
          console.log(response);
          alert("Form submitted successfully! Redirecting...");
          window.location.href = "/login"; // Replace with the URL you want to redirect to
        },
        error: function (error) {
          // Handle errors
          console.error("Error submitting form:", error);
          alert("Error submitting form. Please try again.");
        },
      });
    }
  });
});

// ตรวจสอบความถูกต้องของ password
function validate_password(password) {
  $("#password_strength_status").show();
  var number = /([0-9])/;
  var upper_case = /([A-Z])/;
  var lower_case = /([a-z])/;
  var special_characters = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/;

  var characters = password.length >= 8 && password.length <= 15;
  var capitalletters = password.match(upper_case) ? 1 : 0;
  var loweletters = password.match(lower_case) ? 1 : 0;
  var numbers = password.match(number) ? 1 : 0;
  var special = password.match(special_characters) ? 1 : 0;

  this.update_info("length", password.length >= 8 && password.length <= 15);
  this.update_info("capital", capitalletters);
  this.update_info("small", loweletters);
  this.update_info("number", numbers);
  this.update_info("special", special);

  var total = characters + capitalletters + loweletters + numbers + special;
  this.measure_password_security(total);
}

function update_info(criterion, isValid) {
  var $password_criteria = $("#password_criterion").find(
    'li[data_criterion="' + criterion + '"]'
  );
  if (isValid) {
    $password_criteria.removeClass("invalid").addClass("valid");
  } else {
    $password_criteria.removeClass("valid").addClass("invalid");
  }
}
// วัดระดับความปลอดภัยของ password
function measure_password_security(total) {
  var meter = $("#password_strength_status");
  meter.removeClass();
  if (total === 0) {
    $(".pswd_info").slideUp();
    meter.html("");
  } else if (total === 1) {
    $(".pswd_info").slideDown();
    meter.addClass("veryweak_password").html("very weak");
  } else if (total === 2) {
    $(".pswd_info").slideDown();
    meter.addClass("weak_password").html("weak");
  } else if (total === 3) {
    $(".pswd_info").slideDown();
    meter.addClass("medium_password").html("medium");
  } else if (total === 4) {
    $(".pswd_info").slideDown();
    meter.addClass("average_password").html("average");
  } else {
    $(".pswd_info").slideDown();
    meter.addClass("strong_password").html("strong");
  }
}

/* แสดงข้อความ หาก error พร้อมเหตุผล เปลี่ยนเป็น class error */
function set_error(element, message) {
  const input_control = element.parent();
  const error_display = input_control.find(".error_message");

  error_display.text(message);
  input_control.addClass("error").removeClass("pass");
}
``;
function set_success(element) {
  const input_control = element.parent();
  const error_display = input_control.find(".error_message");

  error_display.text("");
  input_control.addClass("pass").removeClass("error");
}

// ตรวจสอบ inputs เบื้องต้นว่าเหมือนเดิมหรือไม่ พร้อม แสดงข้อความ หาก error
function prevent_default_inputs() {
  var total = 0;

  const password_value = $("#change_password").val();
  const password2_value = $("#password_confirm").val();

  if (password_value === "") {
    set_error($("#change_password"), "Password is required");
  } else if (password_value.length < 8) {
    set_error($("#change_password"), "Password must be at least 8 characters");
  } else {
    set_success($("#change_password"));
    total += 1;
  }

  if (password2_value === "") {
    set_error($("#password_confirm"), "Please confirm your password");
  } else if (password2_value !== password_value) {
    set_error($("#password_confirm"), "Passwords don't match");
  } else {
    set_success($("#password_confirm"));
    total += 1;
  }

  if (total === 2) {
    return true;
  }
}

