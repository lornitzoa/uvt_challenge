$( () => {
  ////////////////////////////////////////
  //     Variables
  ////////////////////////////////////////

  let uvt = '00:00.000' // unique view time
  let vidTimeString = '0' // video length in string format
  let vidTimeNumber = 0 // video length in number format
  let handleTimer = 0 // timer placeholder
  let currentLocation = 0 // current location value for range element
  // let d = new Date(`2018-04-15T00:00:00`)
  let m = 0 // minutes variable
  let s = 0 // seconds variable
  let ms = 0 // milliseconds variable
  let play = false // whether video is playing or not
  let vf = [] // view fragments array
  let vfIndex = 0 // vf current index place holder for adding stopTime key value to objects
  let uvtArr = [] // unique view times array

  // set value of UVT element
  $('#uvt').text(uvt)

  ////////////////////////////////////////
  //           Functions
  ////////////////////////////////////////


  /////////////////////////////////////////
  //////// Conversion Functions ///////////

  const convertUnitsToMs = (m, s, ms) => {
    let totalMS = (m*60000) + (s*1000) + ms
    return totalMS
  }

  const convertStrUnitsToTimeStr = (m, s, ms) => {
    let mL = checkStrLength(m, 2)
    let sL = checkStrLength(s, 2)
    let msL = checkStrLength(ms, 3)
    return `${mL}:${sL}.${msL}`
  }

  const convertStringToMs = (timeStr) => {

  }

  const convertMsToString = (timeAsMS) => {
    mL = ''
    sL = ''
    msL = ''
    if(timeAsMS > 59000) {
      mL = checkStrLength((Math.floor(timeAsMS / 60000)).toString(),2)
      sL = checkStrLength(((timeAsMS - (mL * 60000)).toString().slice(-5,-3)),2) || '00'
      msL = checkStrLength(timeAsMS.toString().slice(-3),3) || '000'
    } else {
      mL = '00'
      sL = checkStrLength(timeAsMS.toString().slice(-5,-3),2) || '00'
      msL = checkStrLength(timeAsMS.toString().slice(-3),3)
    }
    return `${mL}:${sL}.${msL}`

  }

  const checkStrLength = (str, length) => {
    let unitStr = ''
    let placesNeeded = length - str.length
    if(placesNeeded > 0) {
      for(let i = 0; i < placesNeeded; i++) {
        unitStr += '0'
      }
      unitStr += str
    } else {
      unitStr = str
    }
    return unitStr
  }

  /////////////////////////////////////////
  ////////// Timer functions //////////////

  const timer = () => {
    currentLocation += 10 // millisecond incrementation per interval ** after testing, 4 seemed to be the best increment for having the timer close to actual duration of one second.

    // user current location to set range value/position
    $('#range')[0].value = currentLocation

    // convert currentLocation to time string and set as text for timeElapsed display element
    $('#timeElapsed').text(convertMsToString(currentLocation))

    // set vf[vfIndex].endTime to currentLocation
    vf[vfIndex].endTime = currentLocation

    // check uvtArr against current view fragment and update uvtArr
    updateUVT(vf[vfIndex])

    // calculate the UVT and set the uvt display text
    $('#uvt').text(calcUVT())

    // update the timeline
    updateTimeLine()

    // force stop at end of range
    if (currentLocation >= vidTimeNumber) {
      stopTimer()
    }
  }

  const stopTimer = () => {
    // stop timer interval
    clearInterval(handleTimer)
    // change text on stopStart button
    $('#stopStart').text('>')
    // set play to false for toggling of button functionality
    play = false
    // find object at current vf index and set endTime key value
    vf[vfIndex].endTime = currentLocation
    // increment vfIndex for next pair
    vfIndex ++
    // console.log(vf)
    // console.log(uvtArr);
  }

  // updated timeElapsed element when slider is moved, called by range html element's onChange event
   updateTimerVal = (val) => {
     currentLocation = parseInt(val)
     $('#timeElapsed').text(convertMsToString(currentLocation))

   }


  /////////////////////////////////////////
  ////// UVT Calculation functions ////////

  // calculates the unique view time (uvt)
  const calcUVT = () => {
    let uvtL = 0 // local uvt variable to update global uvt variable after calculation
    for(let i = 0; i < uvtArr.length; i++) {
      uvtL += (uvtArr[i].endTime - uvtArr[i].startTime)
    }
    // console.log(uvtL);
    return convertMsToString(uvtL)
  }

  const updateUVT = (obj) => {
    // if the array is empty push a new object
    if(uvtArr.length === 0) {
      uvtArr.push(obj)
    } else {
      // if the array has elements, check of the current vf object exists in the array
      if(uvtArr.includes(obj) === false) {
        // if it doesn't check if the start time against existing uvt elements
        if(checkStartTimeOverlap(obj) === false) {
            // if it doesn't, push the object
            uvtArr.push(obj)
        }
      } else if(uvtArr.includes(obj) === true) { // if the object does exist, i.e it is the current object with a running end time
        // check if the end time is running into an existing uvt element
        checkEndTimeOverlap(obj)
      }
    }
    console.log(uvtArr);
  }

  const checkStartTimeOverlap = (obj) => {
    // console.log(obj.endTime);
    for(let i = 0; i < uvtArr.length; i++) {
      if(obj.startTime === uvtArr[i].startTime) { // check if same start time
        console.log('same start time');
        if(obj.endTime > uvtArr[i].endTime) {
          // console.log('later end time of same start time');
          // console.log(i);
          // check if end time is in range of any following uvtArr elements
          for(let x = (i+1); x < uvtArr.length; x++) {
            if(uvtArr[i].endTime >= uvtArr[x].startTime && uvtArr[i].endTime < uvtArr[x].endTime) {
              // console.log('within existing range');
              // console.log(x);
              uvtArr[i].endTime = uvtArr[x].endTime
              uvtArr.splice((i+1), x)
            }
          }
          uvtArr[i].endTime = obj.endTime
          // return true to prevent pushing of new object
          return true
        }
        // return true to prevent pushing of new object
        return true
      } else if (obj.startTime > uvtArr[i].startTime && obj.startTime < uvtArr[i].endTime) { // check if start time is within range of existing UVT pair
        // console.log(obj.endTime);
        // console.log('start time within range: ' + i );
        if(obj.endTime > uvtArr[i].endTime) {
          // console.log('later end time of same start time');
          // console.log(i);
          // check if end time is in range of any following uvtArr elements
          ///////// probably don't need to do a for loop here could just check next array element's start and end times.
          for(let x = (i+1); x < uvtArr.length; x++) {
            // console.log(uvtArr[x]);
            if(obj.endTime >= uvtArr[x].startTime && obj.endTime <= uvtArr[x].endTime) {
              // console.log('end time within existing range');
              // console.log(x);
              // if current location is in next UVT element range, update previous element's end time
              uvtArr[i].endTime = uvtArr[x].endTime
              // splice the array to remove the overlapping element
              uvtArr.splice((i+1), x)
              // return true to prevent pushing of new object
              return true
            }
          }
          uvtArr[i].endTime = obj.endTime
          // return true to prevent pushing of new object
          return true
        }
        return true
      } else if(obj.startTime === uvtArr[i].endTime) { // check if start time matches an end time
        // console.log('start time same as end time');
        // if match found, set array element's end time to current location i.e. obj.endTime
        uvtArr[i].endTime = obj.endTime
        // return true to prevent pushing of new object
        return true;
      }
    }
    // console.log(obj.endTime);
    // return false to push new object
    return false
  }

  // checks if current time is with range of existing uvt elements
  const checkEndTimeOverlap = (obj) => {
    // loop through uvt array
    for(let i = 0; i < uvtArr.length; i++) {
      // if current time is within range of given pair
      if(currentLocation > uvtArr[i].startTime && currentLocation < uvtArr[i].endTime) {
        // console.log('currentLocation within existing range');
        // set matched element's start time to current view fragments start time;
        uvtArr[i].startTime = obj.startTime
        uvtArr.splice(uvtArr.indexOf(obj),1)

        // console.log(uvtArr[i]);
        return

      }
    }
  }

  const updateTimeLine = () => {
    // loop through uvtArr
    $('#timeline').empty()
    // uvtArr.sort()
    uvtArr.sort((a, b) => {
      return a.startTime - b.startTime
    })
    for(let i = 0; i < uvtArr.length; i++) {
      let uvtDivCheckID = 'uvt' + i
      let noUVTDivCheckId = 'nUVT' + i
      let startsAtBeginning = 0 // variable to add to i later if noUVTDivCheckID needs to be incremented
      let existingChartUVTSArr = $('#timeline').children()
      // console.log(existingChartUVTSArr);
      let existingChartIDsArr = []
      for(let x = 0; x < existingChartUVTSArr.length; x++) {
        existingChartIDsArr.push(existingChartUVTSArr[x].id)
      }
      // console.log(existingChartIDsArr);
      if(i === 0 && uvtArr[i].startTime !== 0 && !existingChartIDsArr.includes(noUVTDivCheckId)) {
        // console.log('first uvt in arr doesn\'t start at beginning ');
        let nUVTWidth = Math.round((uvtArr[i].startTime/vidTimeNumber)*100) + '%'
        let noViewDiv = $('<div>').addClass('noViewDiv').attr('id', noUVTDivCheckId).width(nUVTWidth)
        $('#timeline').prepend(noViewDiv)
        startsAtBeginning = 1
      }
      if(existingChartIDsArr.includes(uvtDivCheckID)) {
        // console.log('div exists: ' + uvtDivCheckID);
        let uvtWidth = Math.round(((uvtArr[i].endTime - uvtArr[i].startTime)/vidTimeNumber)*100) + '%'
        // console.log(uvtWidth);
        $(`#${uvtDivCheckID}`).width(uvtWidth)
        if(existingChartIDsArr.includes(noUVTDivCheckId) && i < uvtArr.length - 1) {
          let noUVTWidth = Math.round(((uvtArr[i+1].startTime - uvtArr[i].endTime)/vidTimeNumber)*100) + '%'
          $(`#${noUVTDivCheckId}`).width(noUVTWidth)
        } else if(i === uvtArr.length - 1 && uvtArr[i].endTime !== vidTimeNumber) {
          let noUVTWidth = Math.round(((vidTimeNumber - uvtArr[i].endTime)/vidTimeNumber)*100) + '%'
          $(`#${noUVTDivCheckId}`).width(noUVTWidth)
        }
      }  else { // create new divs
        let newUvtDivId = 'uvt' + i
        let newNoUVTDivID = 'nUVT' + (i + startsAtBeginning)

        let uvtWidth = Math.round(((uvtArr[i].endTime - uvtArr[i].startTime)/vidTimeNumber)*100) + '%'
        let nUVTWidth = 0
        if(i !== uvtArr.length - 1) { // if not at the end of the array
          nUVTWidth = Math.round(((uvtArr[i+1].startTime - uvtArr[i].endTime)/vidTimeNumber)*100) + '%'
        } else {
          if(uvtArr[i].endTime !== vidTimeNumber) { // if it is the last one check if the end time is not the end of the video
            nUVTWidth = Math.round(((vidTimeNumber - uvtArr[i].endTime)/vidTimeNumber)*100) + '%'
          }
        }
        let uvtDiv = $('<div>').addClass('uvtDiv').attr('id', newUvtDivId).width(uvtWidth)
        let nUVTDiv = $('<div>').addClass('noViewDiv').attr('id', newNoUVTDivID).width(nUVTWidth)
        $('#timeline').append(uvtDiv)
        $('#timeline').append(nUVTDiv)
      }

    }

  }


  ////////////////////////////////////////
  //     Event Handlers
  ////////////////////////////////////////

  $('form').on('submit', (e) => {
    // prevent default form submission
    e.preventDefault()
    let mEnd = $('#vidMM')[0].value  // variable holds video end time minutes
    let sEnd = $('#vidSS')[0].value  // variable holds video end time seconds
    let msEnd = $('#vidMS')[0].value  // variable holds video end time millisecond

    // convert string units to time string format 00:00.000 for display purposes
    vidTimeString = convertStrUnitsToTimeStr(mEnd, sEnd, msEnd)
    $('#vidLength').text(vidTimeString)
    $('.sliderWrapper').css('display', 'block')

    // convert string units to milliseconds for calculation purposes
    vidTimeNumber = convertUnitsToMs(parseInt(mEnd), parseInt(sEnd), parseInt(msEnd))
    $('#range').attr('max', vidTimeNumber)

  })

  // handle start stop of timer
  $('#stopStart').on('click', (e) => {
      // create empty object to stor startTime and stopTime pairs
      let vfObj = {}
      if(play === false) { // functionality to start timer
        // use currentLocation variable to add startTime to vfObj
        vfObj.startTime = currentLocation
        // console.log('start time: ' +  currentLocation);
        // push vfObj to vf array
        vf.push(vfObj)
        // start timer
        handleTimer = setInterval(timer, 1)
        // change text on stopStart button
        $('#stopStart').text('||')
        // set play to true for toggling of button functionality
        play = true
        // console.log(vf)
      } else if(play === true) { // functionality to stop timer
        stopTimer()
      }
    }
  )



}) // this closes document ready
