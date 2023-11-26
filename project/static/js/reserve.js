$(document).ready(function () {
    $("#reserve-room-button").click(function() {
        checkRoomNumber();
        var urlParams = new URLSearchParams(window.location.search);
        var checkinDate = urlParams.get('checkin');
        var checkoutDate = urlParams.get('checkout');
        var number_room_2 = parseInt(document.getElementById("2bed-number-available").innerText);
        var number_room_1 = parseInt(document.getElementById("1bed-number-available").innerText);
        console.log(checkinDate, checkoutDate, number_room_2 , number_room_1);
        SubmitForm()
      });
});

/* validate Input */

document.addEventListener('DOMContentLoaded', function () {
    // ดึงค่าจาก URL parameters
    var urlParams = new URLSearchParams(window.location.search);
    var checkinDate = urlParams.get('checkin');
    var checkoutDate = urlParams.get('checkout');
    var adult = urlParams.get('adult');
    var child = urlParams.get('child');

    var [year_in, month_in, day_in] = checkinDate.split('-');
    var [year_out, month_out, day_out] = checkoutDate.split('-');

    // แสดงค่าใน element
    document.getElementById('2bed-checkin-dateDD').innerText = day_in;
    document.getElementById('2bed-checkin-dateMM').innerText = month_in;
    document.getElementById('2bed-checkin-dateYYYY').innerText = year_in;

    document.getElementById('2bed-checkout-dateDD').innerText = day_out;
    document.getElementById('2bed-checkout-dateMM').innerText = month_out;
    document.getElementById('2bed-checkout-dateYYYY').innerText = year_out;

    document.getElementById('1bed-checkin-dateDD').innerText = day_in;
    document.getElementById('1bed-checkin-dateMM').innerText = month_in;
    document.getElementById('1bed-checkin-dateYYYY').innerText = year_in;

    document.getElementById('1bed-checkout-dateDD').innerText = day_out;
    document.getElementById('1bed-checkout-dateMM').innerText = month_out;
    document.getElementById('1bed-checkout-dateYYYY').innerText = year_out;

    document.getElementById('2bed-checkin-dateD').innerText = day_in;
    document.getElementById('2bed-checkin-dateM').innerText = month_in;
    document.getElementById('2bed-checkin-dateY').innerText = year_in;

    document.getElementById('2bed-checkout-dateD').innerText = day_out;
    document.getElementById('2bed-checkout-dateM').innerText = month_out;
    document.getElementById('2bed-checkout-dateY').innerText = year_out;

    document.getElementById('1bed-checkin-dateD').innerText = day_in;
    document.getElementById('1bed-checkin-dateM').innerText = month_in;
    document.getElementById('1bed-checkin-dateY').innerText = year_in;

    document.getElementById('1bed-checkout-dateD').innerText = day_out;
    document.getElementById('1bed-checkout-dateM').innerText = month_out;
    document.getElementById('1bed-checkout-dateY').innerText = year_out;

    document.getElementById('reserve-value-adult').innerText  = adult;
    document.getElementById('reserve-value-child').innerText  = child;

    console.log('Check-in Date:', typeof checkinDate);
    console.log('Check-out Date:', checkoutDate);
    console.log('Adult:', adult);
    console.log('Child:', child);
});


function TwoUpdateValue(elementId, increment) {
    let MyElement = document.getElementById(elementId);
    let min = parseInt(MyElement.getAttribute("min"));
    let max = parseInt(MyElement.getAttribute("max"));
    let val = parseInt(MyElement.innerHTML);
    let newValue = 0;
    newValue = val + increment;

    if (newValue >= min && newValue <= max) {
        MyElement.innerHTML = newValue;
        document.getElementById("2number-room").innerHTML = Number(newValue);
    }
    console.log(Number(MyElement.innerHTML))
}

function OneUpdateValue(elementId, increment) {
    let MyElement = document.getElementById(elementId);
    let min = parseInt(MyElement.getAttribute("min"));
    let max = parseInt(MyElement.getAttribute("max"));
    let val = parseInt(MyElement.innerHTML);
    let newValue = 0;
    newValue = val + increment;

    if (newValue >= min && newValue <= max) {
        MyElement.innerHTML = newValue;
        document.getElementById("1number-room").innerHTML = Number(newValue);
    }
    console.log(Number(newValue))
}

function checkRoomNumber() {
    
    var urlParams = new URLSearchParams(window.location.search);
    var adult = urlParams.get('adult');

    var number_room_2 = parseInt(document.getElementById("2bed-number-available").innerText);

    var number_room_1 = parseInt(document.getElementById("1bed-number-available").innerText);

    var number_adult = Number(adult);
  
    // คำนวณจำนวนห้องทั้งหมด
    var total_room = number_room_2 + number_room_1;
    var total_number_adult = number_adult / total_room;
    console.log(total_room)
  
    // ตรวจสอบว่าจำนวนห้องทั้งหมดมากกว่าเท่ากับ 1 หรือน้อยกว่าเท่ากับ 2
    if (total_number_adult >= 1 && total_number_adult <= 2) {
      // แสดงข้อความว่า "จำนวนห้องเพียงพอ"
      alert("จำนวนห้องเพียงพอ");
    } else if (total_number_adult < 1) {
      // แสดงข้อความว่า "จำนวนห้องไม่เพียงพอ"
      alert("จำนวนห้องมากกว่าจำนวนคน");
    }
    else {
        alert("จำนวนห้องไม่เพียงพอ");
    }
  };

  function SubmitForm() {

    $.ajax({                                        // call backend /customer/list
        url:  '/customer/list',
        type:  'get',
        dataType:  'json',
    });
  }