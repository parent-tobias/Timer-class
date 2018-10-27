# Timer-class
A simple ES6 Timer class

I was thinking about the challenges on freecodecamp.com, and how easily extensible they are. It is very easy to code the challenge solutions in a quick-and-dirty way, but they are also very adaptable to pretty elegant code.

To this end, I revisited the pomodoro timer challenge, and began breaking it down to atomic parts: an increment-decrement component, a timer component, and action buttons. So, of the three, the most interesting was the timer. I wanted to create something that could be reused, that would be clean and extensible and as ES6 as I could make it. Thus, this particular class.

The Timer class is instantiated with an object, and the available options are:

```
{
  title,      // String, stored for reference
  time,       // Number, starting countdown point
  format,     // String, text to be inserted in DOM node
  onTick,     // Function, event handler for a 'tick' Event
  onComplete  // Function, event handler for a 'complete' Event
}
```

This class can be used in one of two ways: either to create a DOM node and listen for events, or with no visible component and just use callbacks to handle those same events. You can mix and match; it is possible to add an onComplete callback, use the DOM node, and simply listen for ticks on that DOM node, works fine.

Either way, you instantiate the Timer class with the above settings (`let myTimer = new Timer({...});`), you inject the DOM node somewhere if you want it (`timerContainer.appendChild(myTimer.domEl);`), and you start the timer going (`myTimer.start()`). 
