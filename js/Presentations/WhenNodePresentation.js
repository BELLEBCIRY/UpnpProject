define	( [ './PnodePresentation.js'
		  , '../utils.js'
		  , '../DragDrop.js'
		  , './Var_UsePresentation.js'
		  ]
		, function(PnodePresentation, utils, DragDrop, Var_UsePresentation) {

var WhenNodePresentation = function() {
	PnodePresentation.prototype.constructor.apply(this, []);
	return this;
}

WhenNodePresentation.prototype = new PnodePresentation();
WhenNodePresentation.prototype.className = 'WhenNode';

WhenNodePresentation.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	this.PnodeID = PnodeID;
	this.when = { childEvent	: null
				, childReaction	: null
				, varName		: 'brick'
				, varType		: []
				};
	this.configDragVar    = { constructor	: Var_UsePresentation
							, htmlNode		: null		// this.html.variableName
							, nodeType		: []		// this.event.varType
							, id			: null		// this.event.varId
							, name			: 'brick'	// self.event.eventName
							};
	return this;
}

WhenNodePresentation.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	json.children = []; // info debug to be sure to remove children, should already be empty.
	json.when = { varName	: this.html.variableName.innerHTML };
 	if(this.when.childEvent   ) {json.when.childEvent		= this.when.childEvent.serialize   ();}
	if(this.when.childReaction) {json.when.childReaction	= this.when.childReaction.serialize();}
	json.subType		= 'WhenNodePresentation';
	return json;
}

WhenNodePresentation.prototype.unserialize	= function(json, PresoUtils) {
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	if(json.when.childEvent   ) {this.when.childEvent		= PresoUtils.unserialize(json.when.childEvent   ); this.appendChild(this.when.childEvent	 );}
	if(json.when.childReaction) {this.when.childReaction	= PresoUtils.unserialize(json.when.childReaction); this.appendChild(this.when.childReaction);}
	// Implicit variabe
	this.when.varName	= json.when.varName;
	this.when.varType	= json.when.varType;
	
	if(this.html.variableName) {
		 this.html.variableName.innerHTML = "";
		 this.html.variableName.appendChild( document.createTextNode(this.when.varName) );
		 for(var i=0; i<this.when.varType.length; i++) {
			 this.html.variableName.classList.add( this.when.varType[i] );
			}
		}

	this.configDragVar.nodeType	= this.when.varType;
	this.configDragVar.id		= json.when.varId;
	this.configDragVar.name		= json.when.varName;
	this.configDragVar.config	= { id		: this.configDragVar.id
								  , name	: this.configDragVar.name
								  };
	return this;
}

WhenNodePresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('ActionNode');
	if(!this.divChildren) {
		 this.divDescription.innerHTML = 'WhenNode:' + this.PnodeID ;
		 
		 this.divChildren = document.createElement('div');
			root.appendChild( this.divChildren );
			this.divChildren.classList.add('children');
		// Event part
		 this.divEvent		= document.createElement('div');
		 self.divEvent.innerText = ' Drop event here ';
		 this.divChildren.appendChild(this.divEvent);
			this.dropZoneEventId = DragDrop.newDropZone( self.divEvent
								, { acceptedClasse	: 'EventNode'
								  , CSSwhenAccepted	: 'possible2drop'
								  , CSSwhenOver		: 'ready2drop'
								  , ondrop			: function(evt, draggedNode, infoObj) {
										 self.removeChild( self.when.childEvent );
										 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																					, undefined	// parent
																					, undefined	// children
																					, infoObj
																					);
										 self.when.childEvent = Pnode; //new infoObj.constructor(infoObj).init( '' );
										 self.divEvent.innerText = '';
										 self.appendChild(  self.when.childEvent );
										 // DragDrop.deleteDropZone( self.dropZoneEventId );
										}
								  }
								);
		// Implicit variable
		 this.divImplicitVariable = document.createElement('div');
		 this.divImplicitVariable.innerHTML = '<span class="label">let the call it <div class="variableName Pnode Pselector_variable">brick</div>)</span>'
		 this.divChildren.appendChild( this.divImplicitVariable );
		 // Configure variableName
		 this.html.variableName = this.divImplicitVariable.querySelector('.variableName');
		 // Draggable property
		 self.configDragVar.htmlNode	= this.html.variableName;
		 DragDrop.newDraggable ( this.html.variableName
							   , this.configDragVar
							   );
		 // Edition mode
		 utils.HCI.makeEditable( this.html.variableName );		
		 this.html.variableName.innerHTML = "";
		 this.html.variableName.appendChild( document.createTextNode(this.when.varName) );
		 for(var i=0; i<this.when.varType.length; i++) {
			 this.html.variableName.classList.add( this.when.varType[i] );
			}

		// Reaction part
		 this.divReaction	= document.createElement('div');
		 self.divReaction.innerText = 'Reaction here';
		 this.divChildren.appendChild(this.divReaction);
			this.dropZoneReactionId = DragDrop.newDropZone( this.divReaction
								, { acceptedClasse	: [['Pnode', 'instruction']]
								  , CSSwhenAccepted	: 'possible2drop'
								  , CSSwhenOver		: 'ready2drop'
								  , ondrop			: function(evt, draggedNode, infoObj) {
										 self.removeChild( self.when.childReaction );
										 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																					, undefined	// parent
																					, undefined	// children
																					, infoObj
																					);
										 self.when.childReaction = Pnode; //new infoObj.constructor(infoObj).init( '' );
										 self.divReaction.innerText = '';
										 self.appendChild( self.when.childReaction );
										 // DragDrop.deleteDropZone( self.dropZoneReactionId );
										}
								  }
								);
		}
	return root;
}
WhenNodePresentation.prototype.deletePrimitives = function() {
	var self = this;
	PnodePresentation.prototype.deletePrimitives.apply(this, []);
	if(this.divChildren) {
		 if(this.divChildren.parentNode) {this.divChildren.parentNode.removeChild( this.divChildren );}
		 delete this.divChildren;
		 this.divChildren = this.divEvent = this.divReaction = null;
		 DragDrop.deleteDropZone( self.dropZoneEventId    );
		 DragDrop.deleteDropZone( self.dropZoneReactionId );
		}
	return this;
}

WhenNodePresentation.prototype.primitivePlug	= function(c) {
	if(c && c === this.when.childEvent   ) {this.divEvent.innerText	  = '';
										    this.divEvent.appendChild( c.Render() );
										   }
	if(c && c === this.when.childReaction) {this.divReaction.innerText = '';
										    this.divReaction.appendChild( c.Render() );
										   }
}

// Return the constructor
return WhenNodePresentation;
});