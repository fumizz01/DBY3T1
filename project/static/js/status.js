$(document).ready(function () {
    // ทำการเรียก function เมื่อหน้าเว็บโหลดเสร็จ
    loadData();

    function loadData() {
        // ทำ AJAX request ไปยัง endpoint ของคุณ
        $.ajax({
            url: '',  // แก้ไขเป็น URL ของ API หรือ endpoint ที่คุณใช้
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // ทำการเรียกฟังก์ชั่นเพื่อแสดงข้อมูลในตาราง
                displayData(data);
            },
            error: function (error) {
                console.log('Error:', error);
            }
        });
    }

    function displayData(data) {
        // เลือก tbody ของตาราง
        var tbody = $('#table_main tbody');

        // เคลียร์ข้อมูลทั้งหมดใน tbody
        tbody.empty();

        // วนลูปเพื่อแสดงข้อมูลในตาราง
        $.each(data, function (index, item) {
            // Clone แถวที่ซ่อนไว้เพื่อเตรียมข้อมูล
            var newRow = $('.hide').clone().removeClass('hide');

            // กำหนดข้อมูลในแถว
            newRow.find('.room_number').text(item.room_number);
            newRow.find('.check_in').text(item.check_in);
            newRow.find('.check_out').text(item.check_out);
            newRow.find('.price').text(item.price);
            newRow.find('.customer').text(item.customer);
            newRow.find('.status').text(item.status);

            // เพิ่มแถวใน tbody
            tbody.append(newRow);
        });
    }
});

