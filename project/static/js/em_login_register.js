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
    validatePassword(password);
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
      !preventDefaultInputs(
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
    validateDuplicateDataAndSubmitForm(user_name);
  });
});

// ตรวจสอบความถูกต้องของ password
function validatePassword(password) {
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
  this.measurePasswordSecurity(total);
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
function measurePasswordSecurity(total) {
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
function setError(element, message) {
  const input_control = element.parent();
  const error_display = input_control.find(".error_message");

  error_display.text(message);
  input_control.addClass("error").removeClass("pass");
}

/* หากsuccess เปลี่ยนเป็น class pass*/
function setSuccess(element) {
  const input_control = element.parent();
  const error_display = input_control.find(".error_message");
  error_display.text("");
  input_control.addClass("pass").removeClass("error");
}

// ตรวจเช็คว่าเป็นตัวเลขไหม
function isNumber(value) {
  return !isNaN(value) && typeof value === "number";
}

// ตรวจสอบ inputs เบื้องต้นว่าเหมือนเดิมหรือไม่ พร้อม แสดงข้อความ หาก error
function preventDefaultInputs(
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
    setError($("#firstname"), "กรุณาระบุชื่อ");
  } else {
    setSuccess($("#firstname"));
    total += 1;
  }

  if (lastname_value === "") {
    setError($("#lastname"), "กรุณาระบุนามสกุล");
  } else {
    setSuccess($("#lastname"));
    total += 1;
  }

  if (date_value === "") {
    setError($("#birthday"), "กรุณาระบุวันเกิด");
  } else {
    setSuccess($("#birthday"));
    total += 1;
  }

  if (position_value === "") {
    setError($("#position"), "กรุณาระบุตำแหน่ง");
  } else {
    setSuccess($("#position"));
    total += 1;
  }

  if (sex_value === "") {
    setError($("#sex"), "กรุณาระบุเพศ");
  } else {
    setSuccess($("#sex"));
    total += 1;
  }

  if (address_value === "") {
    setError($("#address"), "กรุณาระบุที่อยู่");
  } else {
    setSuccess($("#address"));
    total += 1;
  }

  if (id_number === "") {
    setError($("#id_number"), "กรุณาระบุรหัสประจำตัวประชาชน");
  } else {
    setSuccess($("#id_number"));
    total += 1;
  }

  if (user_name === "") {
    setError($("#user_name"), "กรุณาระบุชื่อผู้ใช้");
  } else {
    setSuccess($("#user_name"));
    total += 1;
  }

  if (password_value === "") {
    setError($("#register_password"), "Password is required");
  } else if (password_value.length < 8) {
    setError(
      $("#register_password"),
      "Password must be at least 8 characters"
    );
  } else {
    setSuccess($("#register_password"));
    total += 1;
  }

  if (password2_value === "") {
    setError($("#password_confirm"), "Please confirm your password");
  } else if (password2_value !== password_value) {
    setError($("#password_confirm"), "Passwords don't match");
  } else {
    setSuccess($("#password_confirm"));
    total += 1;
  }

  if (total == 10) {
    return true;
  }
}

/* ตรวจสอบว่ามี ข้อมูลสำคัญ ซ้ำกับใน database ไหม */
function validateDuplicateDataAndSubmitForm(user_name) {
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
          setError($("#user_name"), "ชื่อผู้ใช้ซ้ำกับข้อมูลในระบบ");
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
            var error_messages = response.error.password2;
            error_messages.forEach(function (error_message) {
              alert(error_message);
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

document.addEventListener("DOMContentLoaded", function () {
  var birthday_Input = document.getElementById("birthday");
  var current_date = new Date().toISOString().split("T")[0];

  birthday_Input.setAttribute("max", current_date);
});

