const app = angular.module('UVTApp', [])

app.controller('MainController', function() {
  // Variables
  this.uvt = 0
  this.duration = 0
  this.durationHH = '00'
  this.durationMM = '00'
  this.durationSS = '00'
  this.startHH = '00'
  this.startMM = '00'
  this.startSS = '00'
  this.endHH = '00'
  this.endMM = '00'
  this.endSS = '00'

  // Functions
  this.submitDuration = () => {
    this.duration = parseInt(this.durationHH) + ':' + parseInt(this.durationMM) + ':' + parseInt(this.durationSS)
  }



})
