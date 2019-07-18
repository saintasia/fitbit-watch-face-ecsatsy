import document from "document";
import { today } from 'user-activity';
import { HeartRateSensor } from "heart-rate";
import { display } from "display";
import clock from "clock";
import { battery } from "power";
import * as util from "./utils";

const hrmData = document.getElementById("hrm-data");
const dateText = document.getElementById('date');
const clockText = document.getElementById('clock');
const steps = document.getElementById("steps");
const batteryText = document.getElementById("battery");
const distanceText = document.getElementById("distance");
const caloriesText = document.getElementById("calories");

const sensors = [];

//clock
clock.granularity = "minutes"; // seconds, minutes, hours

//weekday formatting
var weekday = new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat")

//month formatting
var month = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec")

//clock
clock.ontick = function(evt) {
  var hours = util.monoDigits(util.zeroPad(evt.date.getHours()));
  var mins = util.monoDigits(util.zeroPad(evt.date.getMinutes()));
  clockText.text = hours + ":" + mins;

  dateText.text = month[evt.date.getUTCMonth()] + ' '
                   + evt.date.getUTCDate() + ' '
                   + '(' + weekday[evt.date.getDay()] + ')'  
};

//battery
batteryText.text = Math.floor(battery.chargeLevel) + "%";

// steps
steps.text = today.adjusted.steps.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// distance
distanceText.text = today.adjusted.distance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "m";

// calories
caloriesText.text = today.adjusted.calories.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "cal";

// heart rate
if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    hrmData.text = hrm.heartRate ? hrm.heartRate + "bpm" : 0 
  });
  sensors.push(hrm);
  hrm.start();
} else {
  hrmData.style.display = "none";
}


display.addEventListener("change", () => {
  // Automatically stop all sensors when the screen is off to conserve battery
  display.on ? sensors.map(sensor => sensor.start()) : sensors.map(sensor => sensor.stop());
});
