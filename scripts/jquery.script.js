// App will have beginning ttime of 25 minutes with a 5 minute break. 
// User can use the input boxes to change these values
// clicking the timer will initiate countdown 
// 	get current time --currentTime function
//		get minutes from date 
// 		add work-time to it -- addTime function
//		calculate differnece between sum and current time
//			print this value to timer div 
(function() {
	"use strict";
var model = {
		inputValues: {
			workTime: {
				hours: 0,
				minutes: 25,


			}, 
			breakTime:{
				hours: 0,
				minutes: 5,

			}
	},
	timerOn: false,

	audioIs: "Disabled",


	currentTimer: {
		workTime: true,
		breakTime: false,
		hoursLeft: 0,
		minutesLeft: undefined	
	},





	
	getCurrentTime: function(){
		return Date.now();
	},
	
	userTime: function() {
		return controller.get.currentTime();
	},


};

////Get 


// var startTime = app.setTime();
// var startMinutes = app.toMinutes(startTime);
// var startSeconds = app.remainingSeconds(startTime);
// var timerAtStart = startMinutes + ":" + startSeconds;
// console.log(timerAtStart);

// var endTime = startMinutes +":" + startSeconds;

// console.log(endTime);

// var x = app.getCurrentTime();
// console.log(x);
var msLeft;
var controller = {
	toggleTimer: function() {
		var currentTimerIs = model.currentTimer;
		if (currentTimerIs.workTime) {
			currentTimerIs.breakTime = true;
			currentTimerIs.workTime = false;
			//redundant conditional
			view.currentTimer();
		} else if (currentTimerIs.breakTime) {
			currentTimerIs.breakTime = false;
			currentTimerIs.workTime = true;
			view.currentTimer();
		}

	},

	toggleAudio: function() {
		if ($('#ding').attr("src") !== "ding.mp3"){
		view.add();
	}	
		var audioIsEnabled = model.audioIs==="Enabled";
		model.audioIs = (audioIsEnabled) ? "Disabled" : "Enabled";

		if (audioIsEnabled) {
			model.audioIs = "Disabled";
			view.disableCheckBox();
		} else {
			model.audioIs = "Enabled";
			view.enableCheckBox();
		}

		controller.toggleAudioText(model.audioIs);

	},

	toggleAudioText: function(arg) {
		var text = arg;

		view.changeAudioText(text);
	},
	set: { 
		 newTime: function(futureMs) {
			var fMs = futureMs;
			var tmpTime = controller.get.currentTime();
			
			var msLeft = 1*fMs - tmpTime; 
			
			if (msLeft < 0) {

				if (model.audioIs === "Enabled") {controller.playAudio();}
				controller.toggleTimer();
				controller.set.pause();
				controller.reset();
				controller.timerInit();
				view.changeText('.text', 'Taking a ', '');
				return;	
			} 
			var set = controller.set;
			var hoursLeft = set.toHours(msLeft);
			var minutesLeft = set.toMinutes(msLeft);
			var secondsLeft = set.remainingSeconds(msLeft) + 1;

			view.showTime(hoursLeft, minutesLeft, secondsLeft);
			model.currentTimer.hoursLeft = set.toHours(msLeft);
			model.currentTimer.minutesLeft =  parseFloat(msLeft/60/1000) % 60;
			
		

		},

		pause: undefined,
		workTime: function(hours, minutes) {
		$('#work-time-hours').val(hours);
		$('#work-time-minutes').val(minutes);
		},

		breakTime: function(hours, minutes) {
		$('#break-time-hours').val(hours);
		$('#break-time-minutes').val(minutes);
		},
		futureTime: function() {
		var timeInMinutes = controller.get.currentTimeInMinutes();

		},
		toMs: function(time) {
		return Math.floor(time*1000*60);
		},

		hoursToMinutes: function(time) {
		return Math.floor(time*60);
		},
		toHours: function(time) {
		return Math.floor(time/1000/60/60);
		},
		toMinutes: function(time) {
		return Math.floor((time/1000/60) % 60);
		},
		remainingSeconds: function(time) {
		return Math.floor((time/1000) % 60);
	},
	},
	get: {
		workTime: {
			hours: function() {
				return $('#work-time-hours').val();
			},
			minutes: function() {
				return $('#work-time-minutes').val();
			}
		},
		breakTime: {
			hours: function() {
				return $('#break-time-hours').val();
				},
			minutes: function() {
				return $('#break-time-minutes').val();
				}
			
		},

		currentTime: function() {
			
			return model.getCurrentTime();
		},
		currentInterval: function() {
			var interval = (model.currentTimer.workTime) ? "work" : "break";
			return	interval;
		},

		currentTimerAmount: function() {
			var currentTimerAmount;
			var isWorkTimer = model.currentTimer.workTime;

			if (isWorkTimer) {
			currentTimerAmount = {
				hoursLeft: controller.get.workTime.hours(),
				minutesLeft: controller.get.workTime.minutes(),
			};
			return currentTimerAmount;
		} else {
			currentTimerAmount = {
				hoursLeft: controller.get.breakTime.hours(),
				minutesLeft: controller.get.breakTime.minutes(),
			};
			return currentTimerAmount;
		}
		},
		
	},
		playAudio: function() {
			$('#ding').trigger('play');
		},
	reset: function() {

		model.currentTimer.minutesLeft = undefined;
		model.currentTimer.hoursLeft = 0;
		model.timerOn = false;
	},

	timerInit: function() {

		if (model.timerOn) {
			return;
		}
		model.timerOn = true;
		var get = controller.get;
		var set = controller.set;
		//If there's a cached value of minutes left use that otherwise use the current time
		var currentTimerAmount = (model.currentTimer.minutesLeft === undefined) ? get.currentTimerAmount() : model.currentTimer;

		
		var hours = currentTimerAmount.hoursLeft; 
		var minutes = currentTimerAmount.minutesLeft; 


		currentTimerAmount.minutesLeft = set.hoursToMinutes(hours) + 1*minutes;

		var currentTimerMs = set.toMs(currentTimerAmount.minutesLeft);
		
		
		//cached current time
		var futureMs = get.currentTime() + currentTimerMs;
		



		set.tick = function(){set.newTime(futureMs);};

		set.tickTock = setInterval(set.tick, 1000);
		
		

		set.pause = function() {


		clearInterval(controller.set.tickTock);
		model.timerOn = false;
		};


	},
	
	
};



var view = {

	currentTimer: function() {
		var timer = $('.cover');
		var isWorkTimer = model.currentTimer.workTime;
		
			if (isWorkTimer) {
				timer.css({"background-color" : "#5cb85c", opacity: '0.4'});

			} else {
				timer.css({"background-color" : "#5bc0de", opacity: '0.4'});

			}
	},

	
	showTime: function(hours, minutes, seconds) {
		var currentTimer = $('.timer');
		var time = [hours, minutes, seconds];
		for (var i = 0; i < time.length; i++) {
			time[i] = (time[i] >= 10 ) ? time[i] : "0" + time[i]; 
		}


		// if (secs < 10) {
		// secs = "0"+secs;
		// } 
		
		currentTimer.html(time[0] + ":" + time[1] + ":" + time[2]);
		
	},

	changeText: function(node, textBefore, textAfter) {
		var currentInterval = controller.get.currentInterval();
		$(node).html(textBefore + currentInterval + textAfter);
	},
	reset: function() {
		$('.start-button').css('display', 'inline-block');
		$('.pause-button').css('display', 'none');
		$('.cover').css({opacity: '0'});
		if (typeof controller.set.pause !== "undefined" ) {
		controller.set.pause();
	}
		// Semi redundant conditional check
		if (model.currentTimer.breakTime) {
			controller.toggleTimer();
		}
		controller.reset();
		view.changeText('.text', 'Ready to get back to ', '?');
		var currentTimers = controller.get.currentTimerAmount();

		view.showTime(currentTimers.hoursLeft, currentTimers.minutesLeft, 0);
	},
	started: function() {
		$('.start-button').css('display', 'none');
		$('.pause-button').css('display', 'inline-block');

		view.currentTimer();
		view.changeText('.text', 'Your ', ' timer has begun' );
		controller.timerInit();

	},
	paused: function() {
		$(".pause-button").css('display', 'none');
		$('.start-button').css('display', 'inline-block');
		$('.cover').css({opacity: '.6'});

		if (typeof controller.set.pause !== "undefined" ) {

		controller.set.pause();
	}
		view.changeText('.text', 'Your ', ' timer is paused');
	},

	add: function() {

		$('#ding').attr('src', 'ding.mp3');
	},

	changeAudioText: function(text) {
		$('.audio').eq(0).html("<h4>Audio alerts: " + text + "</h4>");



	}, 

	keyControl: function(e) {
		   var keyAction = {
//Class selectors remnant of previous function-- may use later
        71  : ['.reset-button', view.reset ],  // g key
        83  : ['.start-button', view.started ], // S key
        80  : ['.pause-button', view.paused ],  // P key
        76 : [undefined, controller.toggleAudio ],
        
      },
          key = e.which,              
          keyArr = keyAction[key],  
          element,
          method;


			// function go (input){
  	// 		 	return input();
  	// 		 }
      
      if(typeof keyArr !== "undefined"){
         element  = keyArr[0]; 
		method = keyArr[1]; 

  		method();
      }
  },

  	disableCheckBox: function() {
  		$('.audio').eq(1).prop('checked', false);
  	},

  	enableCheckBox: function() {
  		$('.audio').eq(1).prop('checked', true);
  	}


};


// On page load init should call controller to get initial
//value of break and work times and send them to the model
//
//

var init = function() {
	
	var set = controller.set;
	var inputValues = model.inputValues;
	set.breakTime(inputValues.breakTime.hours, inputValues.breakTime.minutes);
	set.workTime(inputValues.workTime.hours, inputValues.workTime.minutes);
	controller.pause = undefined;
	view.showTime(0, 25, 0);
};

$(document).ready(function () {
init();	



});

$('body').on('keydown', function(e) {

   view.keyControl(e);

    });

//Controls 
	//for timer

$('.start-button').click(function() {
	
	view.started();
});

$('.pause-button').click(function() {
	view.paused();
});

$('.reset-button').click(function() {
	view.reset();
});

	//for audio

$('.audio').click(function() {

	controller.toggleAudio();
	

});



//71 83 80 76 if (charCode ===  )
//Prevent typing anything other than letters when using textbox
function isNumberKey(e){
    

    var evt = e,
    charCode = (evt.which) ? evt.which : evt.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        view.keyControl(evt);
        return false;
    }
    return true;
}

$('.input').keydown(isNumberKey);


})();


