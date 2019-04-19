$( () => {
  ////////////////////////////////////////
  //     Variables && Global Elements
  ////////////////////////////////////////

  let uvt = 0 // unique view time
  let vidLength = 0 // video length
  let currentLocation = 0 // current location of video
  let rangeVal = 0 // current location value for range element
  let d = new Date(`2018-04-15T00:00:00`)
  let m = 0 // minutes variable
  let s = 0 // seconds variable
  let ms = 0 // milliseconds variable
  let play = false // whether video is playing or not

  $('#uvt').append(uvt)
  $('#range').attr('value', rangeVal)



  const timer = () => {
    if (ms < 999) {
      ms+= 4 // millisecond incrementation per interval >> after testing, 4 seemed to be the best increment for having the timer close to actual duration of one second.

    } else {
      ms = 0
      if (s < 59) {
        s++
      } else {
        s = 0
        m++
      }
    }
    $('#timeElapsed').text(`${m}:${s}`)
    rangeVal = parseInt(`${m}${s}${ms}`)
    console.log(rangeVal)
    $('#range')[0].value = rangeVal
    // rangeVal += 1000
    // // console.log(rangeVal)
    // $('#range').attr('value', rangeVal)
    // // console.log($('#range').attr('value'));
  }


  $('form').on('submit', (e) => {
    e.preventDefault()
    console.log('clicked');
    let m = $('#vidMM')[0].value
    let s = $('#vidSS')[0].value
    let ms = $('#vidMS')[0].value
    vidLength = `${m}:${s}.${ms}`
    let vidTime = new Date(`2018-04-15T00:${vidLength}`)
    vidTimeString = `${vidTime.getMinutes()}${vidTime.getSeconds()}${vidTime.getMilliseconds()}`
    console.log(vidTimeString);
    $('#range').attr('max', parseInt(vidTimeString))
    // console.log($('#range').attr('max'));
    $('#vidLength').text(vidLength)
  })

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

  $('#restart').on('click', (e) => {
    clearInterval(currentLocation)
    d = new Date()
  })


})
