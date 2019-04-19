$( () => {
  ////////////////////////////////////////
  //     Variables
  ////////////////////////////////////////

  let uvt = 0 // unique view time
  let vidLength = '0' // video length
  let vidTimeString = 0
  let currentLocation = 0 // current location of video
  let rangeVal = 0 // current location value for range element
  let d = new Date(`2018-04-15T00:00:00`)
  let m = 0 // minutes variable
  let s = 0 // seconds variable
  let ms = 0 // milliseconds variable
  let play = false // whether video is playing or not

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
    $('#timeElapsed').text(`${m}:${s}`)
    rangeVal = parseInt(`${m}${s}`)
    $('#range')[0].value = rangeVal
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
    vidLength = `${m}:${s}.${ms}` // set vidLength variable
    let vidTime = new Date(`2018-04-15T00:${vidLength}`) // set date value for timer manipulation
    vidTimeString = `${vidTime.getMinutes()}${vidTime.getSeconds()}${vidTime.getMilliseconds()}`
    $('#range').attr('max', parseInt(vidTimeString))
    // console.log($('#range').attr('max'));
    $('#vidLength').text(vidLength)
  })

  // handle start stop of timer
  $('#stopStart').on('click', (e) => {
      if(play === false) {
        currentLocation = setInterval(timer, 1)
        $('#stopStart').text('||')
        play = true
      } else if(play === true) {
        clearInterval(currentLocation)
        $('#stopStart').text('>')
        play = false
      }
    }
  )

  // handle restart of timer
  $('#restart').on('click', (e) => {
    clearInterval(currentLocation)
    d = new Date(`2018-04-15T00:00:00`)
    m = 0
    s = 0
    ms = 0
    $('#range')[0].value = 0
    $('#timeElapsed').text(`${m}:${s}`)
  })


})
