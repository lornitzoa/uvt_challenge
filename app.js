const app = angular.module('UVTApp', [])

app.controller('MainController', function() {
  ////////////////////////////
  //       Variables
  ////////////////////////////
  this.uvt = 0 // Unique View Time
  this.duration = 0
  this.durationHH = '00'
  this.durationMM = '00'
  this.durationSS = '00'
  this.durationMS = '000'

  this.startTime = '00'
  // this.startHH = '00'
  this.startMM = '00'
  this.startSS = '00'
  this.startMS = '000'

  this.endTime = '00'
  // this.endHH = '00'
  this.endMM = '00'
  this.endSS = '00'
  this.endMS = '000'
  this.vf = 0

  ////////////////////////////
  //       Functions
  ////////////////////////////

  // set video duration for timeline and other calculations
  this.submitDuration = () => {
    this.duration = this.durationMM + ':' + this.durationSS + "." + this.duration.MS
    console.log(new Date('2018-04-15T' + this.duration + 'z'))
  }

  // set view fragment start and end times
  this.submitVF = () => {
    this.startTime = this.startHH + ':' + this.startMM + ':' + this.startSS
    this.endTime = this.endHH + ':' + this.endMM + ':' + this.endSS
    let startTime = new Date('2018-04-15T' + this.startTime)
    let endTime = new Date('2018-04-15T' + this.endTime)
    console.log(startTime.getMilliseconds())
    console.log(endTime.getMilliseconds());
    // let viewFragment = this.checkTimeDiff(endTime, startTime)
    // console.log(viewFragment);


    // let viewFragment = (endTime.getHours() - startTime.getHours()) + ':' + (endTime.getMinutes() - startTime.getMinutes()) + ":" + (endTime.getSeconds() - startTime.getSeconds())

    // console.log(viewFragment)
    // console.log(viewFragment.getHours())
  }

  this.checkTimeDiff = (end, start) => {
    let hoursDiff = end.getHours() - start.getHours()
    let minutesDiff = end.getMinutes() - start.getMinutes()
    let secondsDiff = end.getSeconds() - start.getSeconds()
    if(minutesDiff < 0) {
      minutesDiff = 60 + minutesDiff
      hoursDiff -= 1
    }
    if(secondsDiff < 0) {
      console.log(secondsDiff);
      secondsDiff = 60 + secondsDiff
      minutesDiff -= 1
      if(minutesDiff < 0) {
        minutesDiff = 60 + minutesDiff
        hoursDiff -= 1
      }
    }

    return hoursDiff + ":" + minutesDiff + ':' + secondsDiff
  }

  // create fragment pair and push to array for timeline
  // check if fragment spans previously watched fragments
  // if not perfect match, but overlap exists, add additional UVT time to total uvt




})
