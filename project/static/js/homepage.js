$(document).ready( function () {
    setNavigation();
    setDefaultDate();

    document.getElementById('search_room').addEventListener('click', function () {
        // ดึงค่าจาก textCheckinDate และ textCheckoutDate
        var checkinDateValue = document.getElementById('textCheckinDate').value;
        var checkoutDateValue = document.getElementById('textCheckoutDate').value;
        var adult = document.getElementById('my-input-adult').value;
        var child = document.getElementById('my-input-child').value;

    
        // สร้าง URL ที่มีพารามิเตอร์ checkin และ checkout
        var reservationURL = '/reserve?checkin=' + checkinDateValue + '&checkout=' + checkoutDateValue + '&adult=' + adult + '&child=' + child;
    
        // ให้ไปยังหน้าการจอง
        window.location.href = reservationURL;
    });

});

function setDefaultDate() {
    todayDate = new Date();
    document.getElementById('textCheckinDate').valueAsDate = new Date(todayDate);

    todayDate.setDate(todayDate.getDate() + 1);
    tmrDate = new Date(todayDate);

    document.getElementById('textCheckoutDate').valueAsDate = new Date(tmrDate);

}



/* when click dropdown on adult and child */
function stepper(btn) {
    let id = btn.getAttribute("id");
    if (id.includes("adult")) {
        var MyInput = document.getElementById('my-input-adult');
    }
    else if (id.includes("child")) {
        var MyInput = document.getElementById('my-input-child');
    }
    else {
        pass
    }

    let min = MyInput.getAttribute("min");
    let max = MyInput.getAttribute("max");
    let step = MyInput.getAttribute("step");
    let val = MyInput.getAttribute("value");

    if (id.includes("increment")) {
        var newValue = parseInt(val) + 1;
    }
    else {
        var newValue = parseInt(val) - 1;
    }
    
    console.log(newValue >= min);
    if(newValue >= min && newValue <= max)
    {
        MyInput.setAttribute("value", newValue);
    }
    console.log(id,min,max,step,val);
}

//กำหน้าค่าให้วันเข้าเเละออก
document.addEventListener('DOMContentLoaded', function () {
    var currentDate = new Date().toISOString().split('T')[0];
    var currentDate_checkout = new Date();
    currentDate_checkout.setDate(currentDate_checkout.getDate() + 1);
    var formattedDate = currentDate_checkout.toISOString().split('T')[0];

    document.getElementById('textCheckinDate').setAttribute('min', currentDate);
    document.getElementById('textCheckoutDate').setAttribute('min', formattedDate);

    document.getElementById('textCheckinDate').addEventListener('input', function () {
        var checkinDateValue = this.value;
        var checkinDate = new Date(checkinDateValue);
        var minCheckoutDate = new Date(checkinDate);
        minCheckoutDate.setDate(minCheckoutDate.getDate() + 1);

        var currentCheckoutDate = new Date(document.getElementById('textCheckoutDate').value);

        // ตรวจสอบว่าค่า "เช็คเอาท์" ปัจจุบันเลยวัน "เช็คอิน" 1 วันหรือไม่
        if (currentCheckoutDate < minCheckoutDate) {
            // กำหนดค่า "เช็คเอาท์" ให้มีค่าเท่ากับวัน "เช็คอิน" 1 วัน
            document.getElementById('textCheckoutDate').value = minCheckoutDate.toISOString().split('T')[0];
        }

        // อัพเดท min attribute ของ "เช็คเอาท์" เพื่อให้ไม่สามารถเลือกวันที่ก่อน "เช็คอิน" ได้
        document.getElementById('textCheckoutDate').setAttribute('min', minCheckoutDate.toISOString().split('T')[0]);
    });
});


function updateValue(inputId, increment) {
    let MyInput = document.getElementById(inputId);
    let min = parseInt(MyInput.getAttribute("min"));
    let max = parseInt(MyInput.getAttribute("max"));
    let step = parseInt(MyInput.getAttribute("step"));
    let val = parseInt(MyInput.getAttribute("value"));

    let newValue = val + increment * step;

    if (newValue >= min && newValue <= max) {
        MyInput.setAttribute("value", newValue);
    }
}


function setNavigation() {
    var path = window.location.pathname;
    path = path.replace(/\/$/, "");
    path = decodeURIComponent(path);

    $(".nav a").each(function () {
        var href = $(this).attr('href');
        if (path.substring(1, href.length+1) === href) {
            $(this).closest('li').addClass('active');
        }
    });
}