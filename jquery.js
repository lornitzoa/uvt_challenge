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

  // converts time units as string to a time string
  const convertStrUnitsToTimeStr = (m, s, ms) => {
    // format strings to fit the 00:00.000 format
    let mL = checkStrLength(m, 2)
    let sL = checkStrLength(s, 2)
    let msL = checkStrLength(ms, 3)
    return `${mL}:${sL}.${msL}`
  }

  // convert milliseconds to string
  const convertMsToString = (timeAsMS) => {
    // local time unit placeholders
    mL = ''
    sL = ''
    msL = ''
    // checks for
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

  // check string length for formatting
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

  // start playing video
  const timer = () => {
    currentLocation += 4 // millisecond incrementation per interval
    // ** after testing, 4 seemed to be the best increment for having the timer close to actual duration of one second.
    // user current location to set range value/position
    $('#range')[0].value = currentLocation
    // console.log(currentLocation);
    // convert currentLocation to time string and set as text for timeElapsed display element
    $('#timeElapsed').text(convertMsToString(currentLocation))
    // console.log(convertMsToString(currentLocation))
    // set vf[vfIndex].endTime to currentLocation
    vf[vfIndex].endTime = currentLocation
    // console.log(vf)
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

  // stop playing video
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
    vfIndex++
  }


  // updated timeElapsed element when slider is moved, called by range html element's onChange event
  updateTimerVal = (val) => {
    // set currentLocation to value of thumb on range
    currentLocation = parseInt(val)
    // convert currentLocation to time string and update the timeElapse display element
    $('#timeElapsed').text(convertMsToString(currentLocation))
  }



  /////////////////////////////////////////
  ////// UVT Calculation functions ////////

  // calculates the unique view time (uvt)
  const calcUVT = () => {
    // local uvt variable to update global uvt variable after calculation
    let uvtL = 0

    // loop through uvtArr and calculate each element's time duration
    for(let i = 0; i < uvtArr.length; i++) {
      // add element's duration to uvtL
      uvtL += (uvtArr[i].endTime - uvtArr[i].startTime)
    }
    // console.log(uvtL);

    // return the result of converting the uvtL value to a time string
    return convertMsToString(uvtL)
  }


  // update the UVT array
  const updateUVT = (obj) => {
    // if the array is empty push a new object
    if(uvtArr.length === 0) {
      uvtArr.push(obj)
      // console.log(uvtArr)
    } else {
      // if the array has elements, check of the current vf object exists in the array
      if(uvtArr.includes(obj) === false) {
        // console.log(uvtArr)
        // console.log(obj)

        // if it doesn't check if the start time against existing uvt elements
        if(checkStartTimeOverlap(obj) === false) {
            // if it doesn't, push the object
            uvtArr.push(obj)
            // console.log(uvtArr);
        }
      } else if(uvtArr.includes(obj) === true) { // if the object does exist it will be the current view fragment object
        // check if the end time is running into an existing uvt element
        checkEndTimeOverlap(obj)
        // console.log(uvtArr)
        // console.log(obj)
      }
    }
  }



  // check if the start time of current view fragment is with range of any existing uvt element
  const checkStartTimeOverlap = (obj) => {
    // console.log(obj.endTime);
    // loop through uvtArr
    for(let i = 0; i < uvtArr.length; i++) {
      // check if same start time
      if(obj.startTime === uvtArr[i].startTime) {
        // console.log('same start time');
        // if current running end time is greater than the current uvtArr[i] loop element...
        if(obj.endTime > uvtArr[i].endTime) {
          // console.log('later end time of same start time');
          // console.log(i);
          if(i < uvtArr.length - 1) {
            if(obj.endTime > uvtArr[i+1].startTime) {
              uvtArr[i].endTime = uvtArr[i+1].endTime
              // console.log(uvtArr);
              uvtArr.splice((i+1),1)
              // console.log(uvtArr);
              return true
            }
          }
          // replace the earlier end time with the later end time
          uvtArr[i].endTime = obj.endTime
          // return true to prevent pushing of new object
          return true
        }
        // return true to prevent pushing of new object
        return true
      }
      else if (obj.startTime > uvtArr[i].startTime && obj.startTime < uvtArr[i].endTime) { // check if start time is within range of existing UVT pair
        // console.log(obj.endTime);
        // console.log('start time within range: ' + i );
        if(obj.endTime > uvtArr[i].endTime) {
          if(i < uvtArr.length - 1) {
            if(obj.endTime >= uvtArr[i+1].startTime && obj.endTime <= uvtArr[i+1].endTime) {
              // console.log('later end time of same start time');
              // console.log(i);
              // check if end time is in range of any following uvtArr elements

              if(obj.endTime > uvtArr[i+1].startTime) {
                uvtArr[i].endTime = uvtArr[i+1].endTime
                // console.log(uvtArr);
                uvtArr.splice((i+1),1)
                // console.log(uvtArr);
                return true
              }
            }
            uvtArr[i].endTime = obj.endTime
            // return true to prevent pushing of new object
            return true
          } else {
            if(obj.endTime > uvtArr[i].endTime) {
              uvtArr[i].endTime = obj.endTime
            }
          }
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
        return true

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
    let mEndStr = $('#vidMM')[0].value  // variable holds video end time minutes
    let sEndStr = $('#vidSS')[0].value  // variable holds video end time seconds
    let msEndStr = $('#vidMS')[0].value  // variable holds video end time millisecond

    let mEndNo = parseInt(mEndStr) || 0
    let sEndNo = parseInt(sEndStr) || 0
    let msEndNo = parseInt(msEndStr) || 0

    // convert string units to time string format 00:00.000 for display purposes
    vidTimeString = convertStrUnitsToTimeStr(mEndStr, sEndStr, msEndStr)
    $('#vidLength').text(vidTimeString)
    $('.sliderWrapper').css('display', 'block')

    // convert string units to milliseconds for calculation purposes
    vidTimeNumber = convertUnitsToMs(mEndNo, sEndNo, msEndNo)
    $('#range').attr('max', vidTimeNumber)

    $('form').css('display', 'none')

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

  $('#loadNew').on('click', () => {
    $('form').css('display', 'block')
    $('.sliderWrapper').css('display', 'none')
    $('#timeElapsed').text('00:00.000')
    $('#vidMM')[0].value = 'minutes'
    $('#vidSS')[0].value = 'seconds'
    $('#vidMS')[0].value = 'milliseconds'
    $('#range')[0].value = 0
    $('#timeline').empty()
    uvt = '00:00.000' // unique view time
    vidTimeString = '0' // video length in string format
    vidTimeNumber = 0 // video length in number format
    handleTimer = 0 // timer placeholder
    currentLocation = 0 // current location value for range element
    m = 0 // minutes variable
    s = 0 // seconds variable
    ms = 0 // milliseconds variable
    play = false // whether video is playing or not
    vf = [] // view fragments array
    vfIndex = 0 // vf current index place holder for adding stopTime key value to objects
    uvtArr = [] // unique view times array

    // set value of UVT element
    $('#uvt').text(uvt)

  })


  ////////////////////////////////////////
  //              Testing
  ////////////////////////////////////////

  // const checkTestResults = (result, expected, objToUpdate) => {
  //   if(result !== expected) {
  //     objToUpdate.bad++
  //     console.log(`Expected ${expected}, but got ${result}`);
  //   }
  // }
  //
  // const logTestResults = (resultsObj) => {
  //   console.log(`Of ${resultsObj.total} tests, ${resultsObj.bad} failed and ${resultsObj.total - resultsObj.bad} passed`);
  // }

  //
  // // testing for convertUnitsToMs
  // const itConvertsUnitsToMs = (v1, v2, v3, expected) => {
  //   resultsConvertsUnitsToMs.total++
  //   let result = convertUnitsToMs(v1, v2, v3)
  //   checkTestResults(result, expected, resultsConvertsUnitsToMs)
  // }
  //
  // // results obj for itConvertsUnitsToMs
  // let resultsConvertsUnitsToMs = {
  //   total: 0,
  //   bad: 0
  // }
  //
  // // test calls
  // itConvertsUnitsToMs(1,15,135, 75135)
  //
  // // test response
  // logTestResults(resultsConvertsUnitsToMs)
  //
  //
  // // testing for convertStrUnitsToTimeStr
  // const itConvertsStrUnitsToTimeStr = (v1, v2, v3, expected) => {
  //   resultsConvertStrUnitsToTimeStr.total++
  //   let result = convertStrUnitsToTimeStr(v1, v2, v3)
  //   checkTestResults(result, expected, resultsConvertStrUnitsToTimeStr)
  // }
  //
  // // results obj for converts
  // let resultsConvertStrUnitsToTimeStr = {
  //   total: 0,
  //   bad: 0
  // }
  //
  // // test calls
  // itConvertsStrUnitsToTimeStr('1', '15', '153', '01:15.153')
  //
  // // test response
  // logTestResults(resultsConvertStrUnitsToTimeStr)
  //
  //
  // testing for itConvertsMsToString
  // const itConvertsMsToString = (milliseconds, expected) => {
  //   resultsConvertsMsToString.total++
  //   let result = convertMsToString(milliseconds)
  //   checkTestResults(result, expected, resultsConvertsMsToString)
  // }
  //
  // // obj for itConvertsMsToString
  // let resultsConvertsMsToString = {
  //   total: 0,
  //   bad: 0,
  // }
  //
  // // test calls
  // itConvertsMsToString(75135, '01:15.135')
  // itConvertsMsToString(150153, '02:30.153')
  // itConvertsMsToString(120153, '02:00.153')
  //
  // // log test results
  // logTestResults(resultsConvertsMsToString)
  //
  // // test for checkStrLength
  // const itChecksAndModifiesTimeUnitStrings = (string, length, expected) => {
  //   resultsItChecksAndModifiesTimeUnitStrings.total++
  //   let result = checkStrLength(string, length)
  //   checkTestResults(result, expected, resultsItChecksAndModifiesTimeUnitStrings)
  // }
  //
  // // obj for checkStrLength test
  // let resultsItChecksAndModifiesTimeUnitStrings = {
  //   total: 0,
  //   bad: 0
  // }
  //
  // // testing calls
  // itChecksAndModifiesTimeUnitStrings('1', 2, '01')
  // itChecksAndModifiesTimeUnitStrings('', 3, '000')
  //
  // // log results
  // logTestResults(resultsItChecksAndModifiesTimeUnitStrings)



}) // this closes document ready
