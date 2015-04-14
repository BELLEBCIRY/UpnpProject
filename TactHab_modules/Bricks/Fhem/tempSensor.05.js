define( [ './BrickFhem.js'
		// , '../standards/temperature.js'
		]
	  , function(BrickFhem) {
// Define
function tempSensor_05(FhemBridge, listEntry) {
	BrickFhem.apply(this, [FhemBridge, listEntry]);
	this.types.push( 'tempSensor_05' );
	return this;
}

tempSensor_05.prototype = new BrickFhem();
	tempSensor_05.prototype.unreference();
tempSensor_05.prototype.constructor		= tempSensor_05;
tempSensor_05.prototype.getTypeName		= function() {return "tempSensor_05";}

tempSensor_05.prototype.dispose			= function() {
	 BrickFhem.prototype.dispose.apply(this, []);
	}

tempSensor_05.prototype.init			= function(FhemBridge, listEntry) {
	BrickFhem.prototype.init.apply(this, [FhemBridge, listEntry]);
	this.data.push( { time: new Date().getTime()
					, value:parseFloat(listEntry.readings.temperature.value)
					}
				  );
}

tempSensor_05.prototype.extractData		= function(data) {
	 this.TempHumi = { temperature	: parseFloat( data.changed.temperature )
					 };
	 var json  = { time			: new Date().getTime()
				 , temperature	: this.TempHumi.temperature
				 };
	 return json;
	}

tempSensor_05.prototype.update			= function(data) {
		 var json = this.extractData(data);
		 this.emit('update', json);
		}

return tempSensor_05;
});
