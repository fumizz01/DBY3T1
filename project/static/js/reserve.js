$(document).ready(function () {
  /* เมื่อทำการ submit form create reserve */
  document
    .getElementById("create_reserve")
    .addEventListener("submit", function (event) {
      var url_params = new URLSearchParams(window.location.search);
      var adult = url_params.get("adult");
      var child = url_params.get("child");

      var number_room_2 = parseInt(
        document.getElementById("2selected_Room_Count").innerText
      );
      var number_room_1 = parseInt(
        document.getElementById("1selected_Room_Count").innerText
      );

      var number_adult = Number(adult);
      var number_child = Number(child);

      // คำนวณจำนวนห้องทั้งหมด
      var total_room = number_room_2 + number_room_1;
      var total_number_adult = number_adult / total_room;
      var total_number_child = number_child / total_room;
      console.log(total_number_adult, total_number_child);

      // ตรวจสอบว่าจำนวนห้องทั้งหมดมากกว่าเท่ากับ 1 หรือน้อยกว่าเท่ากับ 2
      if (
        total_number_adult >= 1 &&
        total_number_adult <= 2 &&
        total_number_child <= 2
      ) {
        // แสดงข้อความว่า "จำนวนห้องเพียงพอ"
        alert("จำนวนห้องเพียงพอ");
      } else if (
        total_number_adult < 1 &&
        total_number_child >= 1 &&
        total_number_child <= 2
      ) {
        // แสดงข้อความว่า "จำนวนห้องไม่เพียงพอ"
        alert("จำนวนห้องมากกว่าจำนวนคน(ผู้ใหญ่)");
        event.preventDefault();
      } else if (total_number_adult < 1 && total_number_child < 2) {
        // แสดงข้อความว่า "จำนวนห้องไม่เพียงพอ"
        alert("จำนวนห้องมากกว่าจำนวนคน(ผู้ใหญ่)");
        event.preventDefault();
      } else if (total_number_adult < 1 && total_number_child > 2) {
        // แสดงข้อความว่า "จำนวนห้องไม่เพียงพอ"
        alert(
          "เด็กอายุต่ำกว่า 18 ปี จำเป็นต้องมีผู้ใหญ่อยู่ด้วยอย่างน้อย 1 คน"
        );
        event.preventDefault();
      } else if (
        total_number_adult >= 1 &&
        total_number_adult <= 2 &&
        total_number_child > 1
      ) {
        // แสดงข้อความว่า "จำนวนห้องไม่เพียงพอ"
        alert("จำนวนเด็กเกินกว่าความจุของห้อง");
        event.preventDefault();
      } else {
        alert("จำนวนห้องไม่เพียงพอ");
        event.preventDefault();
      }
    });

  /* แสดง password เมื่อกด icon ตา */
  $("body").on("click", "#disable_reserve_room_button", function () {
    alert("กรุณาเข้าสู่ระบบก่อนจองห้อง");
  });

  get_room_detail();
  calculate_date();
  var url_params = new URLSearchParams(window.location.search);
  console.log(url_params);
});

document.addEventListener("DOMContentLoaded", function () {
  // ดึงค่าจาก URL parameters
  var url_params = new URLSearchParams(window.location.search);
  var checkin_date = url_params.get("checkin");
  var checkout_date = url_params.get("checkout");
  var adult = url_params.get("adult");
  var child = url_params.get("child");

  var [year_in, month_in, day_in] = checkin_date.split("-");
  var [year_out, month_out, day_out] = checkout_date.split("-");

  // แสดงค่าใน element
  document.getElementById("2bed_checkin_dateDD").innerText = day_in;
  document.getElementById("2bed_checkin_dateMM").innerText = month_in;
  document.getElementById("2bed_checkin_dateYYYY").innerText = year_in;

  document.getElementById("2bed_checkout_dateDD").innerText = day_out;
  document.getElementById("2bed_checkout_dateMM").innerText = month_out;
  document.getElementById("2bed_checkout_dateYYYY").innerText = year_out;

  document.getElementById("1bed_checkin_dateDD").innerText = day_in;
  document.getElementById("1bed_checkin_dateMM").innerText = month_in;
  document.getElementById("1bed_checkin_dateYYYY").innerText = year_in;

  document.getElementById("1bed_checkout_dateDD").innerText = day_out;
  document.getElementById("1bed_checkout_dateMM").innerText = month_out;
  document.getElementById("1bed_checkout_dateYYYY").innerText = year_out;

  /* ส่วนline summary */
  document.getElementById("2bed_checkin_dateD").innerText = day_in;
  document.getElementById("2bed_checkin_dateM").innerText = month_in;
  document.getElementById("2bed_checkin_dateY").innerText = year_in;

  document.getElementById("2bed_checkout_dateD").innerText = day_out;
  document.getElementById("2bed_checkout_dateM").innerText = month_out;
  document.getElementById("2bed_checkout_dateY").innerText = year_out;

  document.getElementById("1bed_checkin_dateD").innerText = day_in;
  document.getElementById("1bed_checkin_dateM").innerText = month_in;
  document.getElementById("1bed_checkin_dateY").innerText = year_in;

  document.getElementById("1bed_checkout_dateD").innerText = day_out;
  document.getElementById("1bed_checkout_dateM").innerText = month_out;
  document.getElementById("1bed_checkout_dateY").innerText = year_out;

  document.getElementById("reserve_value_adult").innerText = adult;
  document.getElementById("reserve_value_child").innerText = child;

  document.getElementById("reserve_value_child").innerText = child;

  document.getElementById("input_checkin").value =
    month_in + "/" + day_in + "/" + year_in;
  document.getElementById("input_checkout").value =
    month_out + "/" + day_out + "/" + year_out;

  console.log("Check-in Date:", checkin_date);
  console.log("Check-out Date:", checkout_date);
  console.log("Adult:", adult);
  console.log("Child:", child);
});

/* อัพเดตค่าเมื่อ เพิ่มลด จำนวนห้อง ของ ห้องคู่่ */
function two_update_value(elementId, increment) {
  get_room_detail();
  var available_rooms = parseInt($("#2_number_available_room").text());
  let my_element = document.getElementById(elementId);
  let min = parseInt(my_element.getAttribute("min"));
  let max = Number(available_rooms);
  let val = parseInt(my_element.innerHTML);
  let new_value = 0;
  new_value = val + increment;

  if (new_value >= min && new_value <= max) {
    // อัพเดตตัวแปร number_room_2
    my_element.innerHTML = new_value;
    document.getElementById("2number_room").innerHTML = Number(new_value);
    document.getElementById("input_2number_room").value = new_value;
    return new_value;
  }
  console.log(min, max);
}

/* อัพเดตค่าเมื่อ เพิ่มลด จำนวนห้อง ของ ห้องเดี่ยว */
function one_update_value(elementId, increment) {
  get_room_detail();
  var available_rooms = parseInt($("#1_number_available_room").text());
  let my_element = document.getElementById(elementId);
  let min = parseInt(my_element.getAttribute("min"));
  let max = Number(available_rooms);
  let val = parseInt(my_element.innerHTML);
  let new_value = 0;
  new_value = val + increment;

  if (new_value >= min && new_value <= max) {
    my_element.innerHTML = new_value;
    // อัพเดตตัวแปร number_room_1
    document.getElementById("1number_room").innerHTML = Number(new_value);
    document.getElementById("input_1number_room").value = new_value;
    return new_value;
  }
  console.log(min, max);
}

/* คำนวนวันจาก check in check out */
function calculate_date() {
  var url_params = new URLSearchParams(window.location.search);
  var start_date_string = url_params.get("checkin");
  var end_date_string = url_params.get("checkout");

  // แปลง date strings เป็น Date format
  var start_date = new Date(start_date_string);
  var end_date = new Date(end_date_string);

  // คำนวนเวลาที่ต่างกัน หน่วย milliseconds
  var time_difference = end_date - start_date;
  console.log(time_difference.property);

  // คำนวนจำนวนวันที่พัก
  var day_difference = time_difference / (1000 * 60 * 60 * 24);

  console.log("Number of days between the two dates:", day_difference);
  return day_difference;
}

/* รับรายละเอียดของ ห้อง จาก database */
function get_room_detail() {
  $.ajax({
    // call backend /reservation/price
    url: "/reservation/price",
    type: "get",
    dataType: "json",
    success: function (data) {
      if (data.reservation_info.length === (0, 1)) {
        /* หากไม่มีข้อมูลของห้องใน database */
        console.log("กรุณา ใส่ข้อมูล room detail");
      }
      /* แสดงข้อมูลใน console เพื่อตรวจสอบความถูกต้อง */
      console.log(data.reservation_info);
      var single = data.reservation_info[1];
      var double = data.reservation_info[0];
      console.log(single, double);
      console.log(
        single.room_type,
        single.room_price,
        single.room_type_count,
        single.room_capacity_adult,
        single.room_capacity_child
      );
      console.log(
        double.room_type,
        double.room_price,
        double.room_type_count,
        double.room_capacity_adult,
        single.room_capacity_child
      );
      // รับค่าจำนวนวัน
      var date = calculate_date();
      console.log("date", date);
      $("#2bed_price").html(parseFloat(double.room_price).toFixed(2));
      $("#1bed_price").html(parseFloat(single.room_price).toFixed(2));

      $("#2bed_room_capacity_adult").html(double.room_capacity_adult);
      $("#2bed_room_capacity_child").html(double.room_capacity_child);

      $("#room-capacity-adult").html(single.room_capacity_adult);
      $("#room-capacity-child").html(single.room_capacity_child);

      $("#1_number_available_room").html(single.room_type_count);
      $("#2_number_available_room").html(double.room_type_count);

      //room_count
      var single_room_count = parseInt(
        document.getElementById("1selected_Room_Count").innerText
      );
      var double_room_count = parseInt(
        document.getElementById("2selected_Room_Count").innerText
      );
      console.log("sr", single_room_count);
      console.log("dr", double_room_count);
      var single_total_price = single.room_price * date * single_room_count;
      var double_total_price = double.room_price * date * double_room_count;
      console.log("single", single_total_price);
      console.log("double", double_total_price);

      $("#2_bed_total").html(double_total_price);
      $("#1_bed_total").html(single_total_price);
      var total_price = single_total_price + double_total_price;
      $("#bed-total").html(total_price);
      $("#input_total_price").val(total_price);
    },
  });
}

// รับข้อมูลในรูปแบบ JSON จาก backend /customer/list
function submit_form() {
  $.ajax({
    url: "/customer/list",
    type: "get",
    dataType: "json",
  });
}
