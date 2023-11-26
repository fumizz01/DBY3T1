$(document).ready(function () {
    $("#reserve-room-button").click(function() {
        checkRoomNumber();
      });
    get_room_detail();
    date_cal();
    var urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
});

var number_room_2 ;
var number_room_1 ;
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
    get_room_detail();

    if (newValue >= min && newValue <= max) {
        // Update the number_room_2 variable
        MyElement.innerHTML = newValue;
        document.getElementById("2number-room").innerHTML = Number(newValue);
        return newValue;
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
    get_room_detail();

    if (newValue >= min && newValue <= max) {
        MyElement.innerHTML = newValue;
        // Update the number_room_1 variable
        re_room_count();
        document.getElementById("1number-room").innerHTML = Number(newValue);
        return newValue;
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
function date_cal(){
    var urlParams = new URLSearchParams(window.location.search);
    var startDateString = urlParams.get('checkin');
    console.log(startDate);
    var endDateString    = urlParams.get('checkout');
    
    // Convert date strings to Date objects
    var startDate = new Date(startDateString);
    var endDate = new Date(endDateString);

    // Calculate the difference in milliseconds
    var timeDifference = endDate - startDate;
    console.log(timeDifference.property);

    // Calculate the difference in days
    var dayDifference = timeDifference / (1000 * 60 * 60 * 24);

    console.log("Number of days between the two dates:", dayDifference);
    return dayDifference 
};

function get_room_detail(){
    var ROW_NUMBER = 5;
    $.ajax({                                                            // call backend /invoice/detail/IN100/22
        url:  '/reservation/price',
        type:  'get',
        dataType:  'json',
        success: function (data) {
            var single = data.reservation_info[1];
            var double = data.reservation_info[0];
            console.log(single.room_type, single.room_type__room_price , single.room_type_count ,single.room_type__room_capacity_adult, single.room_type__room_capacity_child);
            console.log(double.room_type, double.room_type__room_price , double.room_type_count ,double.room_type__room_capacity_adult, single.room_type__room_capacity_child);
            var date = date_cal();
            console.log("date",date);
            $('#2bed-price').html(parseFloat(double.room_type__room_price).toFixed(2));
            $('#1bed-price').html(parseFloat(single.room_type__room_price).toFixed(2));

            $('#2bed-room-capacity-adult').html(double.room_type__room_capacity_adult);
            $('#2bed-room-capacity-child').html(double.room_type__room_capacity_child);
           
            $('#room-capacity-adult').html(single.room_type__room_capacity_adult);
            $('#room-capacity-child').html(single.room_type__room_capacity_child);

            $('#1-number-available-room').html(single.room_type_count);
            $('#2-number-available-room').html(double.room_type_count);

            //room_count 
            var single_room_count = parseInt(document.getElementById("1bed-number-available").innerText);
            var double_room_count = parseInt(document.getElementById("2bed-number-available").innerText);
            console.log('sr',single_room_count);
            console.log('dr',double_room_count);
            var single_total_price = single.room_type__room_price * date *single_room_count;
            var double_total_price = double.room_type__room_price * date *double_room_count;
            console.log("single",single_total_price);
            console.log("double",double_total_price);


           
            $('#2-bed-total').html(double_total_price);
            $('#1-bed-total').html(single_total_price);
            $('#bed-total').html(single_total_price+double_total_price);
        },
    });
}

function re_room_count(){
    var single_room_count = parseInt(document.getElementById("1bed-number-available").innerText);
    var double_room_count = parseInt(document.getElementById("2bed-number-available").innerText);
    console.log('sr',single_room_count);
};

  function SubmitForm() {

    $.ajax({                                        // call backend /customer/list
        url:  '/customer/list',
        type:  'get',
        dataType:  'json',
    });
  }