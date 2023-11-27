$(document).ready(function () {
    // ทำการเรียก function เมื่อหน้าเว็บโหลดเสร็จ
    loadData();

    $(".status-box").each(function () {
        var statusElement = $(this).find("#status");
        var statusText = statusElement.text();
        if (statusText === "unpaid") {
            statusElement.addClass('unpaid');
        }
    });

    function loadData() {
        // ทำ AJAX request ไปยัง endpoint ของคุณ
        $.ajax({
            url: '',  // แก้ไขเป็น URL ของ API หรือ endpoint ที่คุณใช้
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // ทำการเรียกฟังก์ชั่นเพื่อแสดงข้อมูล
                displayData(data);
            },
            error: function (error) {
                console.log('Error:', error);
            }
        });
    }

    function displayData(data) {
        // เลือก element ที่ต้องการแสดงข้อมูล
        var statusBox = $('.status-box');
        var sumPrice = $('.sum_price .text-price');

        // ตรวจสอบว่ามีข้อมูลหรือไม่
        if (data.length > 0) {
            // แสดงข้อมูลจองล่าสุด
            var latestReservation = data[data.length - 1];

            $('#reservation_id').text(latestReservation.reservation_id);
            $('#room_count').text(latestReservation.room_count + ' ห้อง');
            $('#during').text(latestReservation.check_in + ' - ' + latestReservation.check_out);
            $('#total_price').text(latestReservation.total_price.toFixed(2));
            $('#status').text(latestReservation.status);

            // แสดงราคารวม
            sumPrice.text(latestReservation.total_price.toFixed(2));

            // กำหนดรายละเอียดการจองในปุ่ม
            $('#reserve-room-button').attr('data-reservation-id', latestReservation.reservation_id);
        } else {
            // ถ้าไม่มีข้อมูล
            statusBox.text('ไม่พบข้อมูลการจอง');
            sumPrice.text('0.00');
        }
    }

    // ตรวจสอบการคลิกปุ่ม
    $('#reserve-room-button').on('click', function () {
        var reservationId = $(this).data('reservation-id');
        // ทำสิ่งที่คุณต้องการเมื่อคลิกปุ่ม สามารถเปิดหน้าจอจองห้องได้
        // หรือทำการ redirect ไปยังหน้าจอจองห้องของคุณ
    });


});

