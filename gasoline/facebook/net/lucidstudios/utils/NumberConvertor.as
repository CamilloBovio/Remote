class net.lucidstudios.utils.NumberConvertor{

	function NumberConvertor() {
		
	}
	
	public static function convertToMinutes(totalSeconds:Number) {
		var finalMin:String;
		var finalSec:String;
		//our converting to minutes function
		var minutes:Number = Math.floor(totalSeconds/60);
		//get the minutes
		var seconds:Number = Math.floor(totalSeconds%60);
		//get the remainder (using %)
		
		if (minutes<10) {
			finalMin = "0"+minutes;
		}
		else {
			finalMin = ""+minutes;
		}
		
		if (seconds<10) {
			return minutes+":"+"0"+seconds;
		} else {
			return minutes+":"+seconds;
		}
	}

}