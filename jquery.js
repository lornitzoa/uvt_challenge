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
  //     Functions
  ////////////////////////////////////////

  // handles timer which represents playing of video
  const timer = () => {
    // console.log(currentLocation);
    // increment milliseconds up to 999
    // console.log(uvtArr);
    if (ms < 995) {
      ms += 4 // millisecond incrementation per interval >> after testing, 4 seemed to be the best increment for having the timer close to actual duration of one second.
    } else {
      // reset milliseconds to 0 after reaching 99
      ms = 0
      // increment seconds up to 59
      if (s < 59) {
        s++
      } else {
        // reset seconds to 0
        s = 0
        // increment minutes
        m++
      }
    }
    // set current location to prepare for stopTime logging
    currentLocation = (formatTime(m, s, ms, 'number'))
    // console.log(uvtArr);
    // console.log(currentLocation);
    // user current location to set range value/position
    $('#range')[0].value = currentLocation
    // set timeElapsed element; send time increments to formatTime for formatting
    $('#timeElapsed').text(formatTime(m, s, ms, 'string'))
    // create endTime key value for real-time update
    vf[vfIndex].endTime = currentLocation
    // console.log(vf[vfIndex].endTime);
    updateUVT(vf[vfIndex])
    $('#uvt').text(calcUVT())
    updateTimeLine()
    // console.log(vf[vfIndex].endTime);
  }

  const updateTimeLine = () => {
    // loop through uvtArr
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

  const updateUVT = (obj) => {
    if(uvtArr.length === 0) {
      uvtArr.push(obj)
    } else {
      if(uvtArr.includes(obj) === false) {
        if(checkStartTimeOverlap(obj) === false) {
            uvtArr.push(obj)
        }
      } else if(uvtArr.includes(obj) === true) {
        checkEndTimeOverlap(obj)
      }
    }
    // console.log(uvtArr);
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
        console.log('start time same as end time');
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
        // remove the last/current uvt element to prevent 'true' finding of next check of current view fragment existing in uvtArr (updateUVT)
        uvtArr.pop()
        // console.log(uvtArr[i]);
        return

      }
    }
  }

  // calculates the unique view time (uvt)
  const calcUVT = () => {
    let uvtL = 0 // local uvt variable to update global uvt variable after calculation
    for(let i = 0; i < uvtArr.length; i++) {
      uvtL += (uvtArr[i].endTime - uvtArr[i].startTime)
    }
    return formatUVT(uvtL.toString())
  }

  const formatUVT = (uvt) => {
    // console.log(uvt);
    if(uvt.length <= 3) {
      // local time unit variables
      let mL = 0
      let sL = 0
      let msL = uvt
      return formatTime(mL, sL, msL, 'string')
    } else if(uvt.length <= 5) {
      // local time unit variables
      let mL = 0
      let sL = parseInt(uvt.slice(-uvt.length, -3))
      let msL = parseInt(uvt.slice(-3))
      return formatTime(mL, sL, msL, 'string')
    } else if (uvt.length <= 7) {
      // local time unit variables
      let mL = parseInt(uvt.slice(-uvt.length, -5))
      let sL = parseInt(uvt.slice(-uvt.length, -3))
      let msL = parseInt(uvt.slice(-3))
      return formatTime(mL, sL, msL, 'string')
    }

  }

  // updated timeElapsed element when slider is moved, called by range html element's onChange event
  updateTimerVal = (val) => {
    // convert text from video length inputs to numbers
    m = parseInt(val.slice(-7, -5)) || 0 // slice minutes from value
    s = parseInt(val.slice(-5, -3)) || 0 // slice seconds from value
    ms = parseInt(val.slice(-3)) // slice milliseconds from value
    // set text for timeElapsed element to dragged to location
    $('#timeElapsed').text(formatTime(m, s, ms, 'string'))
    // set rangeVal for dragged to location
    rangeVal = parseInt(`${m}${s}${ms}`)
    // set value for position of range thumb
    $('#range')[0].value = rangeVal
    // set current location for further time manipulation and tracking purposes
    currentLocation = formatTime(m, s, ms, 'number')
    // console.log(currentLocation);
  }


  // check formatting of video length inputs for strings
  const formatTime = (m, s, ms, type) => {
    // format time units to string for formatting to mm:s.ms
      let mSF = m.toString()
      let sSF = s.toString()
      let msSF = ms.toString()
      // minutes (m) and seconds (s) should always have two placeholders
      if(mSF.length < 1) {
        mSF = '00'
      }
      if(mSF.length < 2) {
        mSF = '0' + mSF
      }
      if(sSF.length < 1) {
        sSF = '00'
      }
      if(sSF.length < 2) {
        sSF = '0' + sSF
      }
      // milliseconds (ms) should always have 3 placeholders
      if(msSF.length < 1) {
        msSF = '000'
      }
      if(msSF.length < 2) {
        msSF = '00' + msSF
      }
      if(msSF.length < 3) {
        msSF = '0' + msSF
      }
    // format return data based on type request from function call
    if(type === 'string') {
      timeString = `${mSF}:${sSF}.${msSF}` // set timeString variable
      return timeString // return a string object
    }
    if (type === 'number') {
      numString = parseInt(`${mSF}${sSF}${msSF}`)
      return numString // return a number object
    }

  }

  ////////////////////////////////////////
  //     Event Handlers
  ////////////////////////////////////////

  // handle form submission for video length
  $('form').on('submit', (e) => {
    // prevent default form submission action
    e.preventDefault()
    let m = parseInt($('#vidMM')[0].value) || 0 // variable holds minutes input
    let s = parseInt($('#vidSS')[0].value) || 0 // variable holds seconds input
    let ms = parseInt($('#vidMS')[0].value) || 0 // variable holds milliseconds input
    // set video length as number and set max value for range element
    vidTimeNumber = formatTime(m, s, ms, 'number')
    console.log(vidTimeNumber);
    $('#range').attr('max', vidTimeNumber)
    // set video length as string and set value for vidLength element
    vidTimeString = formatTime(m, s, ms, 'string')
    $('#vidLength').text(vidTimeString)
    $('.sliderWrapper').css('display', 'block')
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
        // console.log('end time: ' +  currentLocation);
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
        console.log(uvtArr);
      }
    }
  )

  // handle restart of timer
  $('#restart').on('click', (e) => {
    // stop timer
    clearInterval(handleTimer)
    // reset all primary time variables
    m = 0
    s = 0
    ms = 0
    $('#range')[0].value = 0
    $('#timeElapsed').text(formatTime(m, s, ms, 'string'))
  })


})
