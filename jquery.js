$( () => {
  ////////////////////////////////////////
  //     Variables
  ////////////////////////////////////////

  let uvt = 0 // unique view time
  let vidTimeString = '0' // video length
  let vidTimeNumber = 0
  let handleTimer = 0 // timer placeholder
  let rangeVal = 0 // current location value for range element
  let d = new Date(`2018-04-15T00:00:00`)
  let m = 0 // minutes variable
  let s = 0 // seconds variable
  let ms = 0 // milliseconds variable
  let play = false // whether video is playing or not
  let currentLocation = 0

  let vf = [] // video fragments
  // let vfID = 0
  let vfIndex = 0
  $('#uvt').append(uvt)
  $('#range').attr('value', rangeVal)



  ////////////////////////////////////////
  //     Functions
  ////////////////////////////////////////

  // handles timer which represents playing of video
  const timer = () => {
    // increment milliseconds up to 999
    if (ms < 999) {
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
    currentLocation = parseInt(`${m}${s}${ms}`)
    // set timeElapsed element; send time increments to checkTimeInputs for formatting
    $('#timeElapsed').text(checkTimeInputs(m.toString(), s.toString(), ms.toString()))
    rangeVal = parseInt(`${m}${s}`)
    $('#range')[0].value = rangeVal

  }

  // updated timeElapsed element when slider is moved
  updateTimerVal = (val) => {
    m = val.slice(-7, -5)
    s = val.slice(-5, -3)
    ms = val.slice(-3)
    $('#timeElapsed').text(checkTimeInputs(m, s, ms))
  }

  // check formatting of video length inputs
  const checkTimeInputs = (m, s, ms) => {
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
    if(ms.length < 1) {
      ms = '000'
    }
    if(ms.length < 2) {
      ms = '00' + ms
    }
    if(ms.length < 3) {
      ms = '0' + ms
    }
    timeString = `${m}:${s}.${ms}` // set timeString variable
    return timeString
  }

  ////////////////////////////////////////
  //     Event Handlers
  ////////////////////////////////////////

  // handle form submission for video length
  $('form').on('submit', (e) => {
    e.preventDefault()
    let m = $('#vidMM')[0].value // variable holds minutes input
    let s = $('#vidSS')[0].value // variable holds seconds input
    let ms = $('#vidMS')[0].value // variable holds milliseconds input
    vidTimeNumber = new Date(`2018-04-15T00:${checkTimeInputs(m, s, ms)}`) // set date value for timer manipulation
    vidTimeNumber = parseInt(`${vidTimeNumber.getMinutes()}${vidTimeNumber.getSeconds()}${vidTimeNumber.getMilliseconds()}`)
    $('#range').attr('max', vidTimeNumber)
    $('#vidLength').text(vidTimeString)
  })

  // handle start stop of timer
  $('#stopStart').on('click', (e) => {
      let vfObj = {}
      if(play === false) { // start timer for video
        vfObj.startTime = currentLocation
        vf.push(vfObj)
        console.log(vf);
        handleTimer = setInterval(timer, 1)
        $('#stopStart').text('||')
        play = true


      } else if(play === true) { // stop timer for video
        clearInterval(handleTimer)
        $('#stopStart').text('>')
        play = false
        vf[vfIndex].endTime = currentLocation
        vfIndex ++
        console.log(vf);
      }
    }
  )

  // handle restart of timer
  $('#restart').on('click', (e) => {
    clearInterval(handleTimer)
    d = new Date(`2018-04-15T00:00:00`)
    m = 0
    s = 0
    ms = 0
    $('#range')[0].value = 0
    $('#timeElapsed').text(`${m}:${s}`)
  })


})
