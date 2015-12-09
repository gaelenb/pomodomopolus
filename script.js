// App will have beginning ttime of 25 minutes with a 5 minute break. 
// User can use the input boxes to change these values
// clicking the timer will initiate countdown 
// 	get current time --currentTime function
// 		add work-time to it -- addTime function
//		calculate differnece between sum and current time
//			print this value to timer div 

var app = {
	countdown: function(){

	},
	getCurrentTime: function(){
		return Date.now();
	},
	currentTime: app.getCurrentTime(),


};

var x = app.getCurrentTime();
console.log(x);