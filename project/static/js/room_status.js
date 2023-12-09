$(document).ready(function () {
  $(".d-flex").each(function () {
    var status_element = $(this).find(".status");
    if (status_element.text().trim().toLowerCase() === "unavailable") {
      $(this).find(".status").addClass("unavailable");
    } else if (status_element.text().trim().toLowerCase() === "available") {
      $(this).find(".status").addClass("available");
    } else {
      $(this).addClass("cencel");
    }
  });

  // ทำการเรียก function เมื่อหน้าเว็บโหลดเสร็จ
  loadData();
});

function loadData() {
  $.ajax({
    url: "",
    type: "GET",
    dataType: "json",
    success: function (data) {
      displayData(data);
    },
    error: function (error) {
      console.log("Error:", error);
    },
  });
}

function displayData(data) {
  // เลือก tbody ของตาราง
  var tbody = $("#table_main tbody");

  // เคลียร์ข้อมูลทั้งหมดใน tbody
  tbody.empty();

  // วนลูปเพื่อแสดงข้อมูลในตาราง
  $.each(data, function (index, item) {
    // Clone แถวที่ซ่อนไว้เพื่อเตรียมข้อมูล
    var newRow = $(".hide").clone().removeClass("hide");

    // กำหนดข้อมูลในแถว
    newRow.find(".room_number").text(item.room_number);
    newRow.find(".check_in").text(item.check_in);
    newRow.find(".check_out").text(item.check_out);
    newRow.find(".price").text(item.price);
    newRow.find(".customer").text(item.customer);
    newRow.find(".status").text(item.status);

    // เพิ่มแถวใน tbody
    tbody.append(newRow);
  });
}

/* filter สถานะใน ตารางสถานะห้อง */
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
      if (
        selectedStatus === "" ||
        txtValue.toUpperCase() === selectedStatus.toUpperCase()
      ) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
