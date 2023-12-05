let result = true;

$(document).ready(function () {
  /*ซ่อน,แสดง password */
  $("body").on("click", ".password_validation", function () {
    $(this).toggleClass("bx-show bx-hide");
    var input = $(".password");
    if (input.attr("type") === "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  });

  /* ซ่อน,แสดง confirmation password */
  $("body").on("click", ".password_confirmation_icon", function () {
    $(this).toggleClass("bx-show bx-hide");
    var input = $(".password_confirmation");
    if (input.attr("type") === "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  });

  /* แสดง password strength */
  $("#password_strength_status").hide();
  $(".pswd_info").hide();
  $("#register_password").keyup(function (event) {
    var password = $("#register_password").val();
    validate_password(password);
  });

  $("#register_form").on("submit", function (event) {
    event.preventDefault();

    const first_value = $("#firstname").val();
    const lastname_value = $("#lastname").val();
    const date_value = $("#birthday").val();
    const tel = $("#tel").val();
    const id_number = $("#id_number").val();

    const emailValue = $("#email").val();
    const user_name = $("#user_name").val();
    const password_value = $("#register_password").val();
    const password2_value = $("#password_confirm").val();

    if (
      !prevent_default_inputs(
        first_value,
        lastname_value,
        date_value,
        tel,
        id_number,
        emailValue,
        user_name,
        password_value,
        password2_value
      )
    ) {
      return;
    }
    validate_duplicate_data_and_submit_form(id_number, emailValue, user_name);
  });

  $("#birthday").change(function () {
    var date = new Date($("#birthday").val());
    var age = calculate_age(date);
    $("#age").val(age);
  });
});

// ตรวจสอบความถูกต้องของ password
function validate_password(password) {
  $("#password_strength_status").show();
  var number = /([0-9])/;
  var upper_case = /([A-Z])/;
  var lower_case = /([a-z])/;

  var characters = password.length >= 8 && password.length <= 15;
  var capitalletters = password.match(upper_case) ? 1 : 0;
  var loweletters = password.match(lower_case) ? 1 : 0;
  var numbers = password.match(number) ? 1 : 0;

  this.update_info("length", password.length >= 8 && password.length <= 15);
  this.update_info("capital", capitalletters);
  this.update_info("small", loweletters);
  this.update_info("number", numbers);

  var total = characters + capitalletters + loweletters + numbers;
  this.measure_password_security(total);
}

// อัพเดทความถูกต้องของ password
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
    meter.addClass("weak_password").html("weak");
  } else if (total === 2) {
    $(".pswd_info").slideDown();
    meter.addClass("medium_password").html("medium");
  } else if (total === 3) {
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
/* หาก success เปลี่ยนเป็น class pass*/
function set_success(element) {
  const input_control = element.parent();
  const error_display = input_control.find(".error_message");

  error_display.text("");
  input_control.addClass("pass").removeClass("error");
}

// ตรวจเช็คว่าเป็นอีเมลไหม
function is_valid_email(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
// ตรวจเช็คว่าเป็นตัวเลขไหม
function is_number(value) {
  return !isNaN(value) && typeof value === "number";
}
/* ตรวจสอบ inputs เบื้องต้นว่าเหมือนเดิมหรือไม่ พร้อม แสดงข้อความ หาก error */
function prevent_default_inputs(
  first_value,
  lastname_value,
  date_value,
  tel,
  id_number,
  emailValue,
  user_name,
  password_value,
  password2_value
) {
  var total = 0;

  if (first_value === "") {
    set_error($("#firstname"), "กรุณาระบุชื่อ");
  } else {
    set_success($("#firstname"));
    total += 1;
  }

  if (lastname_value === "") {
    set_error($("#lastname"), "กรุณาระบุนามสกุล");
  } else {
    set_success($("#lastname"));
    total += 1;
  }

  if (date_value === "") {
    set_error($("#birthday"), "กรุณาระบุวันเกิด");
  } else {
    set_success($("#birthday"));
    total += 1;
  }

  if (tel === "") {
    set_error($("#tel"), "กรุณาระบุเบอร์โทร");
  } else if (!is_number(Number(tel))) {
    set_error($("#tel"), "กรุณากรอกเฉพาะตัวเลข");
  } else if (tel.length < 8) {
    set_error($("#tel"), "must be at least 10 characters");
  } else {
    set_success($("#tel"));
    total += 1;
  }

  if (id_number === "") {
    set_error($("#id_number"), "กรุณาระบุรหัสบัตรประชาชน");
  } else if (!is_number(Number(id_number))) {
    set_error($("#id_number"), "กรุณากรอกเฉพาะตัวเลข");
  } else if (id_number.length < 8) {
    set_error($("#id_number"), "must be at least 13 characters");
  } else {
    set_success($("#id_number"));
    total += 1;
  }

  if (emailValue === "") {
    set_error($("#email"), "กรุณาระบุอีเมลล์");
  } else if (!is_valid_email(emailValue)) {
    set_error($("#email"), "กรุณากรอกรูปแบบ อีเมลล์ ให้ถูกต้อง");
  } else {
    set_success($("#email"));
    total += 1;
  }

  if (user_name === "") {
    set_error($("#user_name"), "กรุณาระบุชื่อผู้ใช้");
  } else {
    set_success($("#user_name"));
    total += 1;
  }

  if (password_value === "") {
    set_error($("#register_password"), "Password is required");
  } else if (password_value.length < 8) {
    set_error(
      $("#register_password"),
      "Password must be at least 8 characters"
    );
  } else {
    set_success($("#register_password"));
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

  if (total == (8, 9)) {
    return true;
  }
}

/* ตรวจสอบว่ามี ข้อมูลสำคัญ ซ้ำกับใน database ไหม */
function validate_duplicate_data_and_submit_form(
  id_number,
  emailValue,
  user_name
) {
  $.ajax({
    // call backend /customer/list
    url: "/customer/list",
    type: "get",
    dataType: "json",
    success: function (all_data) {
      var flag = 1;
      console.log(all_data);
      for (let i = 0; i < all_data.user_info.length; i++) {
        let data = all_data.user_info[i];

        console.log("check1" + data.identification_number + id_number);
        if (
          data.identification_number == id_number &&
          !document
            .getElementById("id_number")
            .parentElement.classList.contains("error")
        ) {
          set_error($("#id_number"), "รหัสบัตรประชาชนซ้ำกับข้อมูลในระบบ");
          console.log("error1");
          flag = 0;
        }

        console.log("check2" + data.email + emailValue);
        if (
          data.email == emailValue &&
          !document
            .getElementById("email")
            .parentElement.classList.contains("error")
        ) {
          set_error($("#email"), "อีเมลซ้ำกับข้อมูลในระบบ");
          console.log("error2");
          flag = 0;
        }
      }

      for (let i = 0; i < all_data.username_list.length; i++) {
        let data = all_data.username_list[i];
        console.log("check3" + data.username + user_name);
        if (
          data.username == user_name &&
          !document
            .getElementById("user_name")
            .parentElement.classList.contains("error")
        ) {
          set_error($("#user_name"), "ชื่อผู้ใช้ซ้ำกับข้อมูลในระบบ");
          console.log("error3");
          flag = 0;
        }
      }

      if (flag === 0) {
        return false;
      }
      const formData = $("#register_form").serialize(); // Serialize the form data

      $.ajax({
        type: "POST",
        url: "customer/register",
        data: formData,
        success: function (response) {
          if (response.error) {
            console.log(response.error);
            var errorMessages = response.error.password2;
            errorMessages.forEach(function (errorMessage) {
              alert(errorMessage);
            });
          } else {
            console.log(response);
            alert("Register successfully! Redirecting...");
            window.location.href = "/home";
          }
        },
      });
    },
    error: function (xhr, status, error) {
      console.log(error);
    },
  });
}

// คำนวนอายุจากวันเกิด
function calculate_age(date) {
  const now = new Date();
  const diff = Math.abs(now - date);
  const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  return age;
}

document.addEventListener("DOMContentLoaded", function () {
  var birthday_Input = document.getElementById("birthday");
  var current_date = new Date().toISOString().split("T")[0];

  birthday_Input.setAttribute("max", current_date);
});
