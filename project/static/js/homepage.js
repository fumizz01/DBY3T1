
$(document).ready(function () {

});
/* when click dropdown on adult and child */
const MyInput = document.getElementById("my-input");
function stepper(btn)
{
    let id = btn.getAttribute("id");
    let min = MyInput.getAttribute("min");
    let max = MyInput.getAttribute("max");
    let step = MyInput.getAttribute("step");
    let val = MyInput.getAttribute("value");
    let calcStep = (id == "increment") ? (step*1):
    (step * -1);
    let newValue = parseInt(val) + calcStep;

    if(newValue >= min && newValue <= max)
    {
        MyInput.setAttribute("value", newValue);
    }
    console.log(id,min,max,step,val);
}