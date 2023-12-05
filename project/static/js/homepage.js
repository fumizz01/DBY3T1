$(document).ready(function () {
  set_default_date();

  document.getElementById("search_room").addEventListener("click", function () {
    // ดึงค่าจาก text_checkin_date และ text_checkout_date
    var checkin_date_value = document.getElementById("text_checkin_date").value;
    var checkout_date_value =
      document.getElementById("text_checkout_date").value;
    var adult = document.getElementById("my_input_adult").value;
    var child = document.getElementById("my_input_child").value;

    // สร้าง URL ที่มีพารามิเตอร์ checkin และ checkout
    var reservationURL =
      "/reserve?checkin=" +
      checkin_date_value +
      "&checkout=" +
      checkout_date_value +
      "&adult=" +
      adult +
      "&child=" +
      child;

    // ให้ไปยังหน้าการจอง
    window.location.href = reservationURL;
  });
});

/* บันทึกวันปัจุบัน เพื่อตั้งเป็นค่าเริ่มต้นการเข้าพัก*/
function set_default_date() {
  todayDate = new Date();
  document.getElementById("text_checkin_date").valueAsDate = new Date(
    todayDate
  );
  todayDate.setDate(todayDate.getDate() + 1);
  tmrDate = new Date(todayDate);
  document.getElementById("text_checkout_date").valueAsDate = new Date(tmrDate);
}

/* เพิ่มลดจำนวนคน */
function stepper(btn) {
  let id = btn.getAttribute("id");
  if (id.includes("adult")) {
    var my_input = document.getElementById("my_input_adult");
  } else if (id.includes("child")) {
    var my_input = document.getElementById("my_input_child");
  } else {
    pass;
  }

  let min = my_input.getAttribute("min");
  let max = my_input.getAttribute("max");
  let step = my_input.getAttribute("step");
  let val = my_input.getAttribute("value");

  if (id.includes("increment")) {
    var new_value = parseInt(val) + 1;
  } else {
    var new_value = parseInt(val) - 1;
  }

  console.log(new_value >= min);
  if (new_value >= min && new_value <= max) {
    my_input.setAttribute("value", new_value);
  }
  console.log(id, min, max, step, val);
}

//กำหนดค่าให้วันเข้าเเละออก
document.addEventListener("DOMContentLoaded", function () {
  var current_date = new Date().toISOString().split("T")[0];
  var current_date_checkout = new Date();
  current_date_checkout.setDate(current_date_checkout.getDate() + 1);
  var formatted_date = current_date_checkout.toISOString().split("T")[0];

  document
    .getElementById("text_checkin_date")
    .setAttribute("min", current_date);
  document
    .getElementById("text_checkout_date")
    .setAttribute("min", formatted_date);

  document
    .getElementById("text_checkin_date")
    .addEventListener("input", function () {
      var checkin_date_value = this.value;
      var checkin_date = new Date(checkin_date_value);
      var min_checkout_date = new Date(checkin_date);
      min_checkout_date.setDate(min_checkout_date.getDate() + 1);

      var current_checkout_date = new Date(
        document.getElementById("text_checkout_date").value
      );

      // ตรวจสอบว่าค่า "เช็คเอาท์" ปัจจุบันเลยวัน "เช็คอิน" 1 วันหรือไม่
      if (current_checkout_date < min_checkout_date) {
        // กำหนดค่า "เช็คเอาท์" ให้มีค่าเท่ากับวัน "เช็คอิน" 1 วัน
        document.getElementById("text_checkout_date").value = min_checkout_date
          .toISOString()
          .split("T")[0];
      }

      // อัพเดท min attribute ของ "เช็คเอาท์" เพื่อให้ไม่สามารถเลือกวันที่ก่อน "เช็คอิน" ได้
      document
        .getElementById("text_checkout_date")
        .setAttribute("min", min_checkout_date.toISOString().split("T")[0]);
    });
});

/* อัพเดทค่าเมื่อทำการเพิ่มลดจำนวนคน */
function update_value(inputId, increment) {
  let my_input = document.getElementById(inputId);
  let min = parseInt(my_input.getAttribute("min"));
  let max = parseInt(my_input.getAttribute("max"));
  let step = parseInt(my_input.getAttribute("step"));
  let val = parseInt(my_input.getAttribute("value"));

  let new_value = val + increment * step;

  if (new_value >= min && new_value <= max) {
    my_input.setAttribute("value", new_value);
  }
}
