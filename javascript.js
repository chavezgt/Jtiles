  var RIGHT_MARGIN = 4;
  var TOP_MARGIN  = RIGHT_MARGIN; 

  class Frame{

  /*class Frame 
    elements:
      origin(vector): represents the direction vector to the frame Origin
      edge1(vector) : lower right corner vector
      edge2(vector) : upper left corner vector
      divBox        : div that is associated with each frame
      offspring     : array with the direct child frames


    methods:
     createOffspring(<vector>, <vector>, <vector>):
        creates a new frame with the specified vectors and appends it as a 
        child to the current Frame. Serves as abstraction barrier to be combined 
        by other methods, into more complex Combinations
     createDivs()
        appends the Frame's div as a child of the <body> Tag
     horizontalSplit(n <integer>)
        horizontally splits the current father into n tiles of the same size
     verticalSplit(n <integer>)
        vertically splits the current father into n tiles of the same size
     
  */
  
    constructor(origin, edge1, edge2){ 
    this.origin = origin;
    this.edge1  = edge1;
    this.edge2  = edge2;
    this.offspring = [];

    //just creates the divBox, doesn't add it to the HTML body
    this.divBox   = document.createElement('div');
    this.divBox.className = "innerBox";

    //define the size and position of the divBox and add them to the style
    var divWidth  = this.edge1.vecLength() - RIGHT_MARGIN;
    var divHeight = this.edge2.vecLength() - TOP_MARGIN;

    this.divBox.style.width   = divWidth.toString() + "px";
    this.divBox.style.height  = divHeight.toString() + "px";
    this.divBox.style.left    = origin.xCord.toString() + "px";
    this.divBox.style.top     = origin.yCord.toString() + "px";
   
   } 


  //the vectors in the parameters must be Unit vectors, beccause
  //frameCoordMap will adapt them to the size of the parent frame
  createOffspring(origin, corner1, corner2 ){
    var newOrigin = origin.frameCoordMap(this);
    var newCorn1 = corner1.frameCoordMap(this).subVector(newOrigin);    
    var newCorn2 = corner2.frameCoordMap(this).subVector(newOrigin);    

    var createdFrame = new Frame(newOrigin, newCorn1, newCorn2);
    this.offspring.push(createdFrame);
  }

   //change the name to "procreate?"
   createOffrspingDivs(){
      var len = this.offspring.length;
    for(var i = 0; i < len; i++){
      this.offspring[i].divToHTML();
    }
   }

   divToHTML(){
      document.getElementsByTagName('body')[0].appendChild(this.divBox);
   }
  

  //higherOrder Combiners
  horizontalSplit(num){

    var deltaX = 1/ num;

    for(var i = 0; i < num; i++){
      var xOrigin = i * deltaX;
      var xLimit  = xOrigin + deltaX;
     
      var orVec  = new Vector(xOrigin, 0.0);
      var xVec   = new Vector(xLimit , 0.0);
      var yVec   = new Vector(xOrigin, 1.0);
      this.createOffspring(orVec,xVec,yVec);
    }
   
    this.createOffspringDivs();
  }
  verticalSplit(num){

    var deltaY = 1/ num;

    for(var i = 0; i < num; i++){
      var yOrigin = i * deltaY;
      var yLimit  = yOrigin + deltaY;
     
      var orVec  = new Vector(0.0, yOrigin);
      var xVec   = new Vector(1.0 , yOrigin);
      var yVec   = new Vector(0.0, yLimit);
      this.createOffspring(orVec,xVec,yVec);
    }
    this.createOffspringDivs();
   
  }

}

class Vector{
  /* Simple mathematical Vector implementation, that takes care of all the
     vector operations required by the frames

     frameCoordMap(n <frame>)
      //scales a Unit vector to the correspondent size of n
      
  */

  constructor(x,y){
  this.xCord = x;
  this.yCord = y;
  }
  
  addVector(vec){
    var newX = this.xCord + vec.xCord;
    var newY = this.yCord + vec.yCord;
    return new Vector(newX,newY);
  }

  

  vecLength(){
    var xSquared = Math.pow(this.xCord,2);
    var ySquared = Math.pow(this.yCord,2);
    return Math.sqrt(xSquared + ySquared);
  }

  subVector(vec){
    var newX = this.xCord - vec.xCord;
    var newY = this.yCord - vec.yCord;
    return new Vector(newX,newY);
  }

  scaleVector(scalar){
    var newX = this.xCord * scalar;
    var newY = this.yCord * scalar;
    return new Vector(newX,newY);
  }

  frameCoordMap(fram){
    var scaledX = fram.edge1.scaleVector(this.xCord);
    var scaledY = fram.edge2.scaleVector(this.yCord);
    var addedV  = scaledX.addVector(scaledY);
    return addedV.addVector(fram.origin);

  }
}

function initialFrame(origin,width,height){
  //Create the initial frame, and append it to body
  var firstFrame = new Frame(origin,width,height);
  firstFrame.divToHTML();
}

//some sample values for debugging purposes
var nullVec = new Vector(0,0);
var v = new Vector(800,0);
var w = new Vector(0,500);

