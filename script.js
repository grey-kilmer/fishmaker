var name="";
var rootBone={
        "name":"",
        "x":0,
        "y":0,
        "child_bones":[]
    };
var currentBone=rootBone;
var importTextures=[];
var textures=[];
var animationStyle=0;
var animationDefintions=[];
var speed=0;
var health=0;
var maxDepth=0;
var minDepth=0;
var prefersBottomFeeding=false;
var abilities=[];


function updateName(){
  name=document.getElementById("name").value
}
function importTexture(){
  importTextures.push(document.getElementById("texture_import").value)
}
function renameBone(){
  currentBone["name"]=document.getElementById("bonename").value
}
function addBone(){
  
}
function addSplinePoint(){
  
}
function selectBone(){
  
}
function selectSplinePoint(){
  
}
function selectTexture(){
  
}
