var name="";
var rootBone={
    "name":"",
    "x":0,
    "y":0,
    "CVariance":180,
    "CCVariance":180,
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
var links={};
linkedItems=document.querySelectorAll(".linked");
for (var x of linkedItems){
  links[x.name]={
    "last_value":x.value,
    "linked_ids":[]
  };
}
for (var x of linkedItems){
  links[x.name]["linked_ids"].push(x.id);
}
function updateName(){
  name=document.getElementById("name").value;
}
function importTexture(){
  importTextures.push(document.getElementById("texture_import").value);
}
function renameBone(){
  currentBone["name"]=document.getElementById("bonename").value;
}
function updateBonePosition(){
  currentBone["x"]=document.getElementById("bonex").value;
  currentBone["y"]=document.getElementById("boney").value;
}
function updateVariances(){
  currentBone["CVariance"]=document.getElementById("clockwise_variance").value;
  currentBone["CCVariance"]=document.getElementById("counter_clockwise_variance").value;
}
function updateLinks(){
  for (var x in links){
    var a=document.getElementById(links[x]["linked_ids"][0]).value;
    var b=document.getElementById(links[x]["linked_ids"][1]).value;
    if (a!=links[x]["last_value"]){
      links[x]["last_value"]=a;
      document.getElementById(links[x]["linked_ids"][1]).value=a;
    }
    else if (b!=links[x]["last_value"]){
      links[x]["last_value"]=b;
      document.getElementById(links[x]["linked_ids"][1]).value=b;
    }
  }
}
updateLinks();
//function updateBoneList
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
