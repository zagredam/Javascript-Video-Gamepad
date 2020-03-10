var gamepads = [];
var video = document.getElementsByTagName("video")[0];
var videoReversed = true;
var videoFullscreen = false;
var button0Pressed = false;
var button1Pressed = false;
var button2Pressed = false;
var button3Pressed = false;
var button4Pressed = false;
var button5Pressed = false;
var button6Pressed = false;
var button7Pressed = false;
var button8Pressed = false;
var axes0Changed = false;
var primaryYaxisChanged = false;
var primaryXaxisChanged = false;
var axes2Changed = false;
var secondaryYaxisChanged = false;
var secondaryXaxisChanged = false;
var gamePadChecker = null;
var videoTags = [];
function checkGamepadButtons(){
	var gamePad = navigator.getGamepads()[0];	
	var primaryXaxis = gamePad.axes[0];
	var primaryYaxis = gamePad.axes[1];
	var secondaryXaxis = gamePad.axes[2];
	var secondaryYaxis = gamePad.axes[3];
	if(primaryYaxis < -0.4 && !primaryYaxisChanged){ //primary joystick up (next video tag mark)
		primaryYaxisChanged = true;
		var availableTags = videoTags.filter(vt => vt > video.currentTime);
		if(availableTags.length > 0){
			video.currentTime = availableTags[0];
		}
	}
	else if(primaryYaxis > 0.4 && !primaryYaxisChanged){ //primary joystick down (last video tag mark)
		var availableTags = videoTags.filter(vt => vt < video.currentTime - 1); //if you are clicking back, you need to adjust for video playing forward
		if(availableTags.length > 0){
			video.currentTime = availableTags[availableTags.length-1];
		}
		primaryYaxisChanged = true;
	}
	else if(Math.abs(primaryYaxis) < 0.4 && primaryYaxisChanged){ // prohibit the holding of the axis to continue jumping tags
		primaryYaxisChanged = false;
	}
	if(primaryXaxis < -0.35 && !primaryXaxisChanged){ //primary joystick left (reverse video pased on xaxis)
		video.currentTime += primaryXaxis * 1.3;
		video.pause();
		primaryXaxisChanged = true;
	}
	else if(primaryXaxis > 0.35 && !primaryXaxisChanged){ //primary joystick right (forward video pased on xaxis)
		video.playbackRate = primaryXaxis * 5;
		video.play();
		primaryXaxisChanged = true;
	}
	else if(primaryXaxisChanged){
		video.playbackRate = 1;
		primaryXaxisChanged = false;
	}
	if(secondaryYaxis > 0.4 && !secondaryYaxisChanged){ //secondary joystick up (next video tag mark)
		var availableTags = videoTags.filter(vt => vt < video.currentTime - 1); //if you are clicking back, you need to adjust for video playing forward
		if(availableTags.length > 0){
			video.currentTime = availableTags[availableTags.length-1];
		}
		secondaryYaxisChanged = true;
	}
	else if(secondaryYaxis < -0.4 && !secondaryYaxisChanged){ //secondary joystick down (last video tag mark)
		
		secondaryYaxisChanged = true;
		var availableTags = videoTags.filter(vt => vt > video.currentTime);
		if(availableTags.length > 0){
			video.currentTime = availableTags[0];
		}
	}
	else if(Math.abs(secondaryYaxis) < 0.4 && secondaryYaxisChanged){ // prohibit the holding of the axis to continue jumping tags
		secondaryYaxisChanged = false;
	}
	if(secondaryXaxis < -0.35 && !secondaryXaxisChanged){ //secondary joystick left (reverse video pased on xaxis)
		video.currentTime += secondaryXaxis * 1.3;
		video.pause();
		secondaryXaxisChanged = true;
	}
	else if(secondaryXaxis > 0.35 && !secondaryXaxisChanged){ //primary joystick right (forward video pased on xaxis)
		video.playbackRate = secondaryXaxis * 5;
		video.play();
		secondaryXaxisChanged = true;
	}
	else if(secondaryXaxisChanged){
		video.playbackRate = 1;
		secondaryXaxisChanged = false;
	}
	if(gamePad.buttons[0].pressed && !button0Pressed ){// A button pressed, pause/play
		if(video.paused){
			video.play();
		}
		else{
			video.pause();
		}
		button0Pressed = true;
	}
	else if(!gamePad.buttons[0].pressed){
		button0Pressed = false;
	}
	if(gamePad.buttons[1].pressed && !button1Pressed ){//B button pressed, mark video at time
		console.log("B button pressed at: "+video.currentTime + " ("+Math.floor(video.currentTime/60)+":"+(Math.floor(video.currentTime%60))+")");
		videoTags.push(video.currentTime);
		videoTags.sort(function(a, b){return a-b});
		button1Pressed = true;
	}
	else if(!gamePad.buttons[1].pressed){
		button1Pressed = false;
	}
	if(gamePad.buttons[2].pressed && !button2Pressed ){//X button pressed, toggle fullscreen
		if(videoFullscreen){
		if (video.requestFullscreen) {
		  video.requestFullscreen();
		} else if (video.mozRequestFullScreen) {
		  video.mozRequestFullScreen();
		} else if (video.webkitRequestFullscreen) {
		  video.webkitRequestFullscreen();
		} else if (video.msRequestFullscreen) { 
		  video.msRequestFullscreen();
		}
		videoFullscreen = true;
		}
		else{
			if (document.exitFullscreen) {
				document.exitFullscreen();
			  } else if (document.mozCancelFullScreen) { /* Firefox */
				document.mozCancelFullScreen();
			  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
				document.webkitExitFullscreen();
			  } else if (document.msExitFullscreen) { /* IE/Edge */
				document.msExitFullscreen();
			  }
			  videoFullscreen = false;
		}
		button2Pressed = true;
	}
	else if(!gamePad.buttons[2].pressed){
		button2Pressed = false;
	}
	if(gamePad.buttons[3].pressed && !button3Pressed ){//Y button pressed (eventually show list of tags)
		console.log("y button pressed");
		button3Pressed = true;
	}
	else  if(!gamePad.buttons[3].pressed){
		button3Pressed = false;
	}
	if(gamePad.buttons[4].pressed ){// Left Bumper pressed (LB), go frame by frame backwards
		video.currentTime -= .05;
		video.playbackRate = .1;
		videoReversed = true;
	}
	else if (videoReversed){ //LB no longer pressed, set video back to normal state
		video.pause();
		video.playbackRate = 1;
		videoReversed = false;
	}
	if(gamePad.buttons[5].pressed){// Right Bumper pressed (RB), go frame by frame forwards
		video.playbackRate = .2;
		video.play();
		button5Pressed = true;
	}
	else if ( video.playbackRate != 1 && button5Pressed){ //RB no longer pressed, set video back to normal state
		video.playbackRate = 1;
		video.pause();
		button5Pressed = false;
	}
	if(gamePad.buttons[6].pressed && !button6Pressed ){//Left Trigger pressed (LT), jump back 30 seconds
		if(video.currentTime < 30){ 
			video.currentTime = 0; //jump to beginning if less than 30 seconds
		}
		else{
			video.currentTime -= 30
		}
		button6Pressed = true;
	}
	else if(!gamePad.buttons[6].pressed){
		button6Pressed = false;
	}
	if(gamePad.buttons[7].pressed && !button7Pressed ){//Right Trigger pressed (RT), jump forward 30 seconds
		if(video.duration - video.currentTime <=0){
			video.currentTime = video.duration; //jump to end and pause if less than 30 seconds
			video.pause();
		}
		else{
			video.currentTime += 30
		}
		button7Pressed = true;
	}
	else if(!gamePad.buttons[7].pressed){
		button7Pressed = false;
	}
}

document.onfullscreenchange = function ( event ) { 
  console.log("FULL SCREEN CHANGE");
  videoFullscreen = !videoFullscreen;
}; 

window.addEventListener("gamepadconnected", function(e){
console.log(e);
setTimeout(function(){
gamePadChecker = setInterval(checkGamepadButtons,100);
},350);
});
window.addEventListener("gamepaddisconnected", function(e){
console.log("gamepaddisconnected");
clearInterval(gamePadChecker);
});