$(document).ready( function () {

    setDefaultDate();

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
    else {
        var MyInput = document.getElementById('my-input-child');
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
