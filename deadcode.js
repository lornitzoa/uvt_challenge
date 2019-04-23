/////////////////////////////////
//  from checkOverlap
////////////////////////////////

// else if (obj.startTime > uvtArr[i].startTime && obj.startTime <= uvtArr[i].endTime) {
//   // console.log('start time within range');
//   if(obj.endTime > uvtArr[i].endTime) {
//     // console.log('later end time of same start time');
//     uvtArr[i].endTime = obj.endTime
//     return true
//   }
//   return true
// } else if( obj.endTime >= uvtArr[i].startTime && obj.endTime <= uvtArr[i].endTime) {
//   // console.log('end time within range');
//   uvtArr[i].startTime = obj.startTime
//   return true
// }



/////////////////////////////////
//  UVT check function attempts
/////////////////////////////////

//
// const checkStartTime = (obj) => {
//   for(let i = 0; i < uvtArr.length; i++) {
//     if(obj.startTime >= uvtArr[i].startTime && obj.startTime <= uvtArr[i].endTime) { // if start time is within range
//       console.log('start time within range');
//       if(obj.endTime > uvtArr[i].endTime) {
//         console.log('later than end time of match');
//         uvtArr[i].endTime = obj.endTime
//         return true
//       }
//       return true
//     }
//   }
//   return false
// }
//
// const checkEndTime = (obj) => {
//   for(let i = 0; i < uvtArr.length; i++) {
//     if(obj.endTime >= uvtArr[i].startTime && obj.endTime <= uvtArr[i].endTime) { // if start time is within range
//       console.log('end time within range');
//       if(obj.startTime < uvtArr[i].startTime) {
//         console.log('earlier than end time of match');
//         uvtArr[i].endTime = obj.endTime
//         return true
//       }
//       return true
//     }
//   }
//   return false
// }

  // console.log(obj);
  // if(uvtArr.length === 0) {
  //   uvtArr.push(obj)
  // } else {
  //   if(uvtArr.includes(obj) === false) {
  //     console.log('check ranges');
  //
  //   }
  //   // console.log(uvtArr.includes(obj));
  //   // if (uvtArr.includes(obj) === false) {
  //   //   console.log('check ranges');
  //   //
  //   //
  //   // } else {
  //   //   uvtArr.push(obj)
  //   // }
  //   // uvtArr.forEach((x) => {
  //   //   if(obj.startTime === x.startTime && obj.endTime !== x.endTime) {
  //   //     console.log('same start time');
  //   //     console.log(x);
  //   //     console.log(obj);
  //   //   //   console.log('same startTime')
  //   //   //   // check if end time is >= to found match's end time.
  //   //   //   // if it is, update the end time,
  //   //   //   // otherwise, move on.
  //   //   } else if (obj.startTime > x.startTime && obj.startTime < x.endTime) {
  //   //     console.log('start time in range, checking end time');
  //   //     console.log(x);
  //   //     console.log(obj);
  //   //   //   console.log('different startTime');
  //   //   //   // check if start time is within any other pairs in array
  //   //   //   // should only find one, so if this is true,
  //   //   //   // compare end times
  //   //   //   // if end time is greater than found match end time
  //   //   //   // update that match's end time
  //   //   //   // otherwise, move on.
  //   // } else {
  //   //   uvtArr.push(obj)
  //   // }
  //   // })
  // else {
  //   uvtArr.push(obj)
  // }
  //
  // console.log(uvtArr);
  // // check every object in vf array against unique range list
  // // if unique, add to unique range list
  // // check for overlap, if over lap subtract overlap and return just the unique range
// }

// checkUnique = (obj) => {
//   uvtArr.forEach((x) => {
//     if(obj.startTime === x.startTime && obj.endTime !== x.endTime) {
//       console.log('same start time');
//       console.log(x);
//       console.log(obj);
//       return false
//     //   console.log('same startTime')
//     //   // check if end time is >= to found match's end time.
//     //   // if it is, update the end time,
//     //   // otherwise, move on.
//     } else if (obj.startTime > x.startTime && obj.startTime < x.endTime) {
//       console.log('start time in range, checking end time');
//       console.log(x);
//       console.log(obj);
//       return false
//     //   console.log('different startTime');
//     //   // check if start time is within any other pairs in array
//     //   // should only find one, so if this is true,
//     //   // compare end times
//     //   // if end time is greater than found match end time
//     //   // update that match's end time
//     //   // otherwise, move on.
//   }
//   })
//   return true
// }




// const checkForString = () => {
//   let unitArr = [m, s, ms]
//   for (let i = 0; i < unitArr.length; i++) {
//     if(i.length < 0) {
//       i = 0
//     } else {
//       i = parseInt(i)
//     }
//   }
// }




/////////////////////////////////
// original form template
/////////////////////////////////

<form ng-submit='ctrl.submitDuration()'>
  <label for="duration">Video Duration</label>
  <br/>
  <!-- <label for="start-hh">hh</label> -->
  <label for="duration-mm">mm</label>
  <label for="duration-ss">ss</label>
  <label for="duration-ms">ms</label>
  <br/>
  <!-- <input type="text" name="duration-hh" ng-model='ctrl.durationHH'>: -->
  <input type="text" name="duration-mm" ng-model='ctrl.durationMM' min=0 max='59'>:
  <input type="text" name="duration-ss" ng-model='ctrl.durationSS' min=0 max='59'>.
  <input type="text" name="duration-ms" ng-model='ctrl.durationMS' min=0 max='999'>
  <input type="submit" name="submit" value="Submit">
</form>
<form ng-submit='ctrl.submitVF()'>
  <label for="vf-start">Start Time:</label>
  <br/>
  <!-- <label for="start-hh">hh</label> -->
  <label for="start-mm">mm</label>
  <label for="start-ss">ss</label>
  <label for="start-ms">ms</label>
  <br/>
  <!-- <input type="text" name="start-hh" ng-model=ctrl.startHH>: -->
  <input type="text" name="start-mm" ng-model=ctrl.startMM min=0 max='59'>:
  <input type="text" name="start-ss" ng-model=ctrl.startSS min=0 max='59'>.
  <input type="text" name="start-ms" ng-model='ctrl.startMS' min=0 max='999'>
  <br/>
  <label for="vf-end">End Time:</label>
  <br/>
  <!-- <label for="end-hh">hh</label> -->
  <label for="end-mm">mm</label>
  <label for="end-ss">ss</label>
  <label for="end-ms">ms</label>
  <br/>
  <!-- <input type="text" name="start-hh" ng-model=ctrl.endHH>: -->
  <input type="text" name="start-mm" ng-model=ctrl.endMM min=0 max='59'>:
  <input type="text" name="start-ss" ng-model=ctrl.endSS min=0 max='59'>.
  <input type="text" name="end-ms" ng-model='ctrl.endMS' min=0 max='999'>
  <input type="submit" name="submit" value="Submit">
</form>
