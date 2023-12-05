let result = true;

$(document).ready(function () {
  /* ซ่อน,แสดง password */
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

  /* ส่งค่าจาก form เมื่อกด submit */
  $("#register_form").on("submit", function (event) {
    event.preventDefault();

    const user_name = $("#user_name").val();
    const password_value = $("#register_password").val();
    const password2_value = $("#password_confirm").val();
    const date_value = $("#birthday").val();
    const id_number = $("#id_number").val();
    const first_value = $("#firstname").val();
    const lastname_value = $("#lastname").val();
    const sex_value = $("#sex").val();
    const address_value = $("#address").val();
    const position_value = $("#position").val();

    if (
      !prevent_default_inputs(
        user_name,
        password_value,
        password2_value,
        date_value,
        id_number,
        first_value,
        lastname_value,
        sex_value,
        address_value,
        position_value
      )
    ) {
      return;
    }
    validate_duplicate_data_and_submit_form(user_name);
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

/* หากsuccess เปลี่ยนเป็น class pass*/
function set_success(element) {
  const input_control = element.parent();
  const error_display = input_control.find(".error_message");
  error_display.text("");
  input_control.addClass("pass").removeClass("error");
}

// ตรวจเช็คว่าเป็นตัวเลขไหม
function is_number(value) {
  return !isNaN(value) && typeof value === "number";
}

// ตรวจสอบ inputs เบื้องต้นว่าเหมือนเดิมหรือไม่ พร้อม แสดงข้อความ หาก error
function prevent_default_inputs(
  user_name,
  password_value,
  password2_value,
  date_value,
  id_number,
  first_value,
  lastname_value,
  sex_value,
  address_value,
  position_value
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

  if (position_value === "") {
    set_error($("#position"), "กรุณาระบุตำแหน่ง");
  } else {
    set_success($("#position"));
    total += 1;
  }

  if (sex_value === "") {
    set_error($("#sex"), "กรุณาระบุเพศ");
  } else {
    set_success($("#sex"));
    total += 1;
  }

  if (address_value === "") {
    set_error($("#address"), "กรุณาระบุที่อยู่");
  } else {
    set_success($("#address"));
    total += 1;
  }

  if (id_number === "") {
    set_error($("#id_number"), "กรุณาระบุรหัสประจำตัวประชาชน");
  } else {
    set_success($("#id_number"));
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

  if (total == 10) {
    return true;
  }
}

/* ตรวจสอบว่ามี ข้อมูลสำคัญ ซ้ำกับใน database ไหม */
function validate_duplicate_data_and_submit_form(user_name) {
  $.ajax({
    // call backend /username/list
    url: "/username/list",
    type: "get",
    dataType: "json",
    success: function (all_data) {
      var flag = 1;
      console.log(all_data);

      for (let i = 0; i < all_data.username_list.length; i++) {
        let data = all_data.username_list[i];

        console.log("check employee username");

        if (
          data.username == user_name &&
          !document
            .getElementById("user_name")
            .parentElement.classList.contains("error")
        ) {
          set_error($("#user_name"), "ชื่อผู้ใช้ซ้ำกับข้อมูลในระบบ");
          console.log("error");
          flag = 0;
        }
      }

      if (flag === 0) {
        //guard clause: หาก error, ไม่ run code ด้านล่าง
        return false;
      }
      // หาก การตรวจสอบผ่าน, send POST request
      const formData = $("#register_form").serialize(); // Serialize the form data

      $.ajax({
        type: "POST",
        url: "/em/register",
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
            window.location.href = "/em/room_status";
          }
        },
      });
    },
    error: function (xhr, status, error) {
      console.log(error);
    },
  });
}
