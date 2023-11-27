$(document).ready(function () {
    $('.d-flex').each(function () {
        var statusElement = $(this).find('.status');
        if (statusElement.text().trim().toLowerCase() === 'unavailable') {
          $(this).find('.status').addClass('unavailable');
        }else if (statusElement.text().trim().toLowerCase() === 'available'){
            $(this).find('.status').addClass('available');
        }else{
            $(this).addClass('cencel');
        }
      });
    
    hideRowsWithEmptyContent();


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


function filter() {
    var table = document.getElementById("table_main");
    var statusFilter = document.getElementById("statusFilter");
    var selectedStatus = statusFilter.value.toUpperCase();
    var tr = table.getElementsByTagName("tr");

    for (var i = 0; i < tr.length; i++) {
        var stat = tr[i].getElementsByTagName("td")[5];
        if (stat) {
            var txtValue = stat.innerText;
            console.log(selectedStatus, txtValue);
            if(selectedStatus === "" || txtValue.toUpperCase() === selectedStatus.toUpperCase()){
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }       
    }
}

function hideRowsWithEmptyContent() {
    var table = document.getElementById("table_main");
    var tr = table.getElementsByTagName("tr");

    console.log("Number of rows:", tr.length);

    for (var i = 1; i < tr.length; i++) {
        var customer = tr[i].getElementsByTagName("td")[4];
        var text = customer.innerText.trim();
        if (text === "") {
            tr[i].style.display = "none";
            console.log("Hiding row:", i);
        }   
    }
}