// App will have beginning ttime of 25 minutes with a 5 minute break. 
// User can use the input boxes to change these values
// clicking the timer will initiate countdown 
// 	get current time --currentTime function
//		get minutes from date 
// 		add work-time to it -- addTime function
//		calculate differnece between sum and current time
//			print this value to timer div 

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
	set: {
		
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
	
	// function for timerInit
	//Need to find which timer should be active = activeTimer
	// get the amount of time set for that timer = amountOfTime
	// get the current time = currentTIme
	// change currentTime to minutes & seconds = minutes; seconds; 
	// add amountOfTime to minutes = futureMinutes + futureSeconds *Constants
		// function newTime 
		// get currentTime = currentTime
		// change currentTime to minutes & seconds = currentMinutes + currentSeconds
		// subtract currentMinutes & currentSeconds from futureMInutes & futureSeconds = minutesLeft & secondsLeft
		// view.showTime(minutesLeft, secondsLeft)

	reset: function() {

		model.currentTimer.minutesLeft = undefined;
		model.currentTimer.hoursLeft = 0;
	},

	timerInit: function() {

		

		var get = controller.get;
		var set = controller.set;
		var currentTimerAmount = (model.currentTimer.minutesLeft === undefined) ? get.currentTimerAmount() : model.currentTimer;

		
		var hours = currentTimerAmount.hoursLeft; 
		var minutes = currentTimerAmount.minutesLeft; 

		console.log(hours + ":" + minutes);
		currentTimerAmount.minutesLeft = set.hoursToMinutes(hours) + 1*minutes;
		console.log(currentTimerAmount.minutesLeft);
		currentTimerMs = set.toMs(currentTimerAmount.minutesLeft);
		
		
		//cached current time
		var futureMs = get.currentTime() + currentTimerMs;


		var newTime = function newTime() {
			var tmpTime = get.currentTime();

			var msLeft = futureMs - tmpTime; 
			
			if (msLeft < 0) {
				controller.toggleTimer();
				controller.pause();
				controller.reset();
				controller.timerInit();
				return;	
			} 
			var hoursLeft = set.toHours(msLeft);
			var minutesLeft = set.toMinutes(msLeft);
			var secondsLeft = set.remainingSeconds(msLeft) + 1;

			view.showTime(hoursLeft, minutesLeft, secondsLeft);
			model.currentTimer.hoursLeft = set.toHours(msLeft);
			model.currentTimer.minutesLeft =  parseFloat(msLeft/60/1000) % 60;
			
			console.log(model.currentTimer.minutesLeft);
			console.log(model.currentTimer.hoursLeft);

		};

		var tickTock = setInterval(newTime, 1000);
		
		//Probably a bad use of this... 
		// but needed it to have access to tickTock
		this.pause = function() {
			console.log(model.currentTimer.minutesLeft);
		
		clearInterval(tickTock);
		};


	},
	
	
};

console.log(controller);

var view = {

	currentTimer: function() {
		var timer = $('.timer');
		var isWorkTimer = model.currentTimer.workTime;
		
			if (isWorkTimer) {
				timer.addClass('work-time');
				timer.removeClass('break-time');
			} else {
				timer.addClass('break-time');
				timer.removeClass('work-time');
			}
	},

	
	showTime: function(hours, minutes, seconds) {
		var currentTimer = $('.timer');
		var secs = seconds;
		if (secs < 10) {
		secs = "0"+secs;
		} 
		
		currentTimer.html(hours + ":" + minutes + ":" + secs);
		
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

	view.showTime(0, 25, 0);
};

$(document).ready(function () {
init();	

});



$('.start-button').click(function() {
$(this).css('display', 'none');
$('.pause-button').css('display', 'inline-block');


controller.timerInit();


});

$('.pause-button').click(function() {
$(this).css('display', 'none');
$('.start-button').css('display', 'inline-block');
controller.pause();
});

$('.reset-button').click(function() {
	$('.start-button').css('display', 'inline-block');
	$('.pause-button').css('display', 'none');
	controller.pause();
	// Semi redundant conditional check
	if (model.currentTimer.breakTime) {
		controller.toggleTimer();
	}
	controller.reset();
	var currentTimers = controller.get.currentTimerAmount();

	view.showTime(currentTimers.hoursLeft, currentTimers.minutesLeft, '00');
});


function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}



