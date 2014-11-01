var pipoDoc;
define	( [ '../protoPresentation.js'
		  , '../../utils.js'
		  ]
		, function(protoPresentation, utils) {
	function MediaRenderer(id, name, idMediaRenderer) {
		 protoPresentation.apply(this, []);
		 var self				= this;
		 this.remoteBrickId		= id;
		 this.idMediaRenderer	= idMediaRenderer;
		 this.name				= name;
		 // Subscribe to events from server
		 utils.io.on( 'eventForBrick_' + this.remoteBrickId
					, function(json) {
						 console.log( self, "received", json);
						}
					);
		 utils.call	( self.remoteBrickId
					, 'getMediasStates'
					, []
					, function(res) {
						 console.log(self.remoteBrickId, 'getMediasStates', res);
						}
					);
		 return this;
		}
		
	MediaRenderer.prototype	= new protoPresentation();
	MediaRenderer.prototype.Render	= function() {
		 var root = protoPresentation.prototype.Render.apply(this, []);
		 if(typeof this.htmlMediaServer === "undefined") {
			 this.htmlMediaServer = document.createElement('p');
				this.htmlMediaServer.appendChild( document.createTextNode( this.remoteBrickId + ' : ' + this.idMediaRenderer ) );
				this.divVariables	= document.createElement('div');
					this.tableVariables	= document.createElement('table');
					this.divVariables.appendChild( this.tableVariables );
				root.appendChild( this.divVariables );
				root.appendChild( this.htmlMediaServer );
			}
		 return root;
		}
	
	return MediaRenderer;
});
