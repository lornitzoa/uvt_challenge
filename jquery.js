$( () => {
  ////////////////////////////////////////
  //     Variables
  ////////////////////////////////////////

  let uvt = 0 // unique view time
  let vidTimeString = '0' // video length in string format
  let vidTimeNumber = 0 // video length in number format
  let handleTimer = 0 // timer placeholder
  let currentLocation = 0 // current location value for range element
  // let d = new Date(`2018-04-15T00:00:00`)
  let m = 0 // minutes variable
  let s = 0 // seconds variable
  let ms = 0 // milliseconds variable
  let play = false // whether video is playing or not
  let vf = [] // video fragments array
  let vfIndex = 0 // vf current index place holder for adding stopTime key value to objects

  // set value of UVT element
  $('#uvt').append(uvt)



  ////////////////////////////////////////
  //     Functions
  ////////////////////////////////////////

  // handles timer which represents playing of video
  const timer = () => {
    // console.log(currentLocation);
    // increment milliseconds up to 999
    if (ms < 995) {
      ms+= 4 // millisecond incrementation per interval >> after testing, 4 seemed to be the best increment for having the timer close to actual duration of one second.
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
    currentLocation = (formatTime(m.toString(), s.toString(), ms.toString(), 'number'))
    // user current location to set range value/position
    $('#range')[0].value = currentLocation
    // set timeElapsed element; send time increments to formatTime for formatting
    $('#timeElapsed').text(formatTime(m.toString(), s.toString(), ms.toString(), 'string'))
  }

  // updated timeElapsed element when slider is moved
  updateTimerVal = (val) => {
    m = val.slice(-7, -5) // slice minutes from value
    s = val.slice(-5, -3) // slice seconds from value
    ms = val.slice(-3) // slice milliseconds from value
    // set text for timeElapsed element to dragged to location
    $('#timeElapsed').text(formatTime(m, s, ms, 'string'))
    // set rangeVal for dragged to location
    rangeVal = parseInt(`${m}${s}${ms}`)
    // set value for position of range thumb
    $('#range')[0].value = rangeVal
    // set current location for further time manipulation and tracking purposes
    currentLocation = formatTime(m, s, ms, 'number')
  }


  // check formatting of video length inputs for strings
  const formatTime = (m, s, ms, type) => {
    // minutes (m) and seconds (s) should always have two placeholders
    if(m.length < 1) {
      m = '00'
    }
    if(m.length < 2) {
      m = '0' + m
    }
    if(s.length < 1) {
      s = '00'
    }
    if(s.length < 2) {
      s = '0' + s
    }
    // milliseconds (ms) should always have 3 placeholders
    if(ms.length < 1) {
      ms = '000'
    }
    if(ms.length < 2) {
      ms = '00' + ms
    }
    if(ms.length < 3) {
      ms = '0' + ms
    }
    if(type === 'string') {
      timeString = `${m}:${s}.${ms}` // set timeString variable
      return timeString // return a string object
    }
    if (type === 'number') {
      numString = parseInt(`${m}${s}${ms}`)
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
    let m = $('#vidMM')[0].value // variable holds minutes input
    let s = $('#vidSS')[0].value // variable holds seconds input
    let ms = $('#vidMS')[0].value // variable holds milliseconds input
    // set video length as number and set max value for range element
    vidTimeNumber = formatTime(m, s, s, 'number')
    $('#range').attr('max', vidTimeNumber)
    // set video length as string and set value for vidLength element
    vidTimeString = formatTime(m, s, s, 'string')
    $('#vidLength').text(vidTimeString)
  })

  // handle start stop of timer
  $('#stopStart').on('click', (e) => {
      // create empty object to stor startTime and stopTime pairs
      let vfObj = {}
      if(play === false) { // functionality to start timer
        // use currentLocation variable to add startTime to vfObj
        vfObj.startTime = currentLocation
        // push vfObj to vf array
        vf.push(vfObj)
        // start timer
        handleTimer = setInterval(timer, 1)
        // change text on stopStart button
        $('#stopStart').text('||')
        // set play to true for toggling of button functionality
        play = true
        console.log(vf)
      } else if(play === true) { // functionality to stop timer
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
        console.log(vf)
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
    $('#timeElapsed').text(formatTime(m.toString(), s.toString(), ms.toString(), 'string'))
  })


})
