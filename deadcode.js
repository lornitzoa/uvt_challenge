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
