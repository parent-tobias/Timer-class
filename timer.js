// Handy function allowing me to pre-pad numbers with leading zeroes.
// This allows 5 min 8sec to display as "05:08"
Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

/******************
 *  Timer class
 *  Initialized with an Object, containing
 *  {
 *    title: String,
 *    time: Number,
 *    format: String (optional, assumes a displayed timer will be used),
 *    onComplete: Function (optional),
 *    onTick: Function (optional)
 *  }
 * 
 * Available methods:
 *   - Timer.start()
 *   - Timer.stop()
 * Methods as getters:
 *   - Timer.domEl
 * Methods as getters/setters:
 *   - Timer.title
 *   - Timer.time
 *   - Timer.onComplete
 *   - Timer.onTick
 * 
 * On the returned DOM element, there are a couple custom events that can
 *   be listened for:
 * 
 *   - "timer.tick" 
 *   - "timer.complete"
 * 
 ******************/
class Timer {
  constructor({ title, time = 60, format = "hh:mm:ss", onComplete, onTick }) {

    // Create a dom node, in the user wants to listen for custom events.
    this._el = document.createElement("span");
    
    // Store properties for our various functions to access.
    this._title = title;
    this._startingTime = time;
    this._timeRemaining = this._startingTime;
    this._format = format;
    
    // Create event handlers, or use the passed callbacks
    this._complete = onComplete || function(){ };
    this._tick= onTick || function(){ }; 
  }

  _render() {
    // decrement the counter
    this._timeRemaining -= 1;

    /***
     * Create some custom events. These need to be created here, as
     *  the values change each tick.
     */
    this._tickEvent = new CustomEvent("timer.tick", {
      detail: {title: this._title, time: this._timeRemaining}
    });
    this._completeEvent = new CustomEvent("timer.complete",{
      detail: {title: this._title, timeElapsed: this._startingTime }
    });

    // Set up the formatted string
    let hours = Math.floor(this._timeRemaining / 3600);
    let minutes = Math.floor( (this._timeRemaining - (hours*3600) )/ 60);
    let seconds = this._timeRemaining % 60;
    let timeString = this._format.replace("hh", hours).replace("mm", minutes.pad(2)).replace("ss", seconds.pad(2) );

    // Inject the formatted string into our DOM element
    this._el.innerText = timeString;

    // Call the tick handler, if any
    this._tick();
    // At the same time, trigger the DOM node's custom tick event.
    this._el.dispatchEvent(this._tickEvent);
    
    // If the timer has reached zero...
    if (this._timeRemaining <= 0){
      // And stop the clock.
      this.stop();
      
      this._timerRemaining = 0;
      // call the complete handler
      this._complete();
      // and trigger the DOM node's custom complete event.
      this._el.dispatchEvent(this._completeEvent);
      

    } 
  }

  // retrieve the DOM node, in case we want to inject that somewhere.
  get domEl(){
    return this._el;
  }
  
  // Get the current timer count, total remaining seconds.
  get time(){
    return this._timeRemaining;
  }
  
  // Set the timer count, as a number of seconds.
  set time(time){
    // As we are setting the timer to a new count, we also need
    //  to replace the startingTime we've saved for reference.
    this._startingTime = time;
    this._timeRemaining = time;
  }
  
  // get the timer's current title.
  get title(){
    return this._title;
  }
  
  // Change the timer's title
  set title(title){
    this._title = title;
  }
  
  // In the event the timer has been reset, the user may want to update the
  //  callbacks. We'll create a couple setters for them.
  set onComplete(callback){    
    this._complete = callback;
  }
  
  set onTick(callback){
    this._tick = callback;
  }

  // Stop the timer. Doesn't clear the time remaining, just pauses.
  stop() {
    clearInterval(this._timer);
  }
  
  // starts the clock and re-renders the DOM el.
  start() {
    this._render();
    this._timer = setInterval(() => this._render(), 1000);
  }
}