const dayStart = "07:30";
const dayEnd = "17:45";

function scheduleMeeting(startTime, durationMinutes)
{
  var [meetingStartHour, meetingStartMinutes] = startTime.split(':');
  durationMinutes = Number(durationMinutes);

  if ('string' === typeof meetingStartHour && 'string' === typeof meetingStartMinutes) {
  	let durationHours = Math.floor(durationMinutes/60);
    durationMinutes =  durationMinutes - (durationHours*60);
    let meetingEndHour = Number(meetingStartHour) + durationHours;
    let meetingEndMinutes = Number(meetingStartMinutes) + durationMinutes;

    if (meetingEndMinutes >= 60) {
      meetingEndHour = meetingEndHour + 1;
      meetingEndMinutes = meetingEndMinutes - 60;
    }

    let meetingStart = `${meetingStartHour.padStart(2, '0')}:${meetingStartMinutes.padStart(2, '0')}`;
    let meetingEnd = `${String(meetingEndHour).padStart(2,'0')}:${String(meetingEndMinutes).padStart(2, '0')}`;

    return (meetingStart >= dayStart && meetingEnd <= dayEnd);
  }

  return false
}

console.log(scheduleMeeting("7:00", 15));
console.log(scheduleMeeting("7:15", 30));
console.log(scheduleMeeting("7:30", 30));
console.log(scheduleMeeting("11:30", 60));
console.log(scheduleMeeting("17:00", 45));
console.log(scheduleMeeting("17:30", 30));
console.log(scheduleMeeting("18:00", 15));
