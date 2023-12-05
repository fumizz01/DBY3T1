$(document).ready(function () {
  // ทำการเรียก function เมื่อหน้าเว็บโหลดเสร็จ
  load_data();

  $(".status-box").each(function () {
    var status_element = $(this).find("#status");
    var status_text = status_element.text();
    if (status_text === "unpaid") {
      status_element.addClass("unpaid");
    }
  });

  function load_data() {
    // ทำ AJAX request ไปยัง endpoint ของคุณ
    $.ajax({
      url: "", // แก้ไขเป็น URL ของ API หรือ endpoint ที่คุณใช้
      type: "GET",
      dataType: "json",
      success: function (data) {
        // ทำการเรียกฟังก์ชั่นเพื่อแสดงข้อมูล
        display_data(data);
      },
      error: function (error) {
        console.log("Error:", error);
      },
    });
  }

  function display_data(data) {
    // เลือก element ที่ต้องการแสดงข้อมูล
    var status_box = $(".status-box");
    var sum_price = $(".sum_price .text_price");

    // ตรวจสอบว่ามีข้อมูลหรือไม่
    if (data.length > 0) {
      // แสดงข้อมูลจองล่าสุด
      var latest_reservation = data[data.length - 1];

      $("#reservation_id").text(latest_reservation.reservation_id);
      $("#room_count").text(latest_reservation.room_count + " ห้อง");
      $("#during").text(
        latest_reservation.check_in + " - " + latest_reservation.check_out
      );
      $("#total_price").text(latest_reservation.total_price.toFixed(2));
      $("#status").text(latest_reservation.status);

      // แสดงราคารวม
      sum_price.text(latest_reservation.total_price.toFixed(2));

      // กำหนดรายละเอียดการจองในปุ่ม
      $("#reserve_room_button").attr(
        "data-reservation-id",
        latest_reservation.reservation_id
      );
    } else {
      // ถ้าไม่มีข้อมูล
      status_box.text("ไม่พบข้อมูลการจอง");
      sum_price.text("0.00");
    }
  }

  // ตรวจสอบการคลิกปุ่ม
  $("#reserve_room_button").on("click", function () {
    var reservationId = $(this).data("reservation-id");
    // ทำสิ่งที่คุณต้องการเมื่อคลิกปุ่ม สามารถเปิดหน้าจอจองห้องได้
    // หรือทำการ redirect ไปยังหน้าจอจองห้องของคุณ
  });
});
