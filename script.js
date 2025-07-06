var name="";
var rootBone={
  "name":"root",
  "x":800,
  "y":300,
  "CVariance":180,
  "CCVariance":180,
  "child_bones":[],
  "parent_bone":"#0",
  "id":"#0",
};
var boneList={
    "#0":rootBone
};
var boneNum=1;
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
    "linked":[]
  };
}
for (var x of linkedItems){
  links[x.name]["linked"].push(x);
}
function updateName(){
  name=document.getElementById("name").value;
}
function importTexture(){
  importTextures.push(document.getElementById("texture_import").value);
}
function renameBone(){
  currentBone["name"]=document.getElementById("bonename").value;
  updateBoneList();
  drawBone();
}
function updateBonePosition(){
  currentBone["x"]=Number.parseInt(document.getElementById("bonex").value);
  currentBone["y"]=Number.parseInt(document.getElementById("boney").value);
  drawBone();
}
function updateVariance(){
  currentBone["CVariance"]=Number.parseInt(document.getElementById("clockwise_variance").value);
  currentBone["CCVariance"]=Number.parseInt(document.getElementById("counter_clockwise_variance").value);
  drawBone();
}
function updateLinks(){
  for (var x in links){
    var a=links[x]["linked"][0].value;
    var b=links[x]["linked"][1].value;
    if (a!=links[x]["last_value"]){
      links[x]["last_value"]=a;
      links[x]["linked"][1].value=a;
    }
    else if (b!=links[x]["last_value"]){
      links[x]["last_value"]=b;
      links[x]["linked"][0].value=b;
    }
  }
}
updateLinks();
function updateBoneList(){
  var list=document.getElementById("bone_chain").childNodes;
  while (list.length>0){
    list[0].remove();
  }
  for (var option of document.querySelectorAll(".boneChoice")){
    option.remove();
  }
  list=document.getElementById("bone_chain");
  updateBoneListPearl(rootBone,list,[false]);
}
function updateBoneListPearl(bone, list, lastChild){
  console.log(lastChild);
  var li=document.createElement("li");
  var option=document.createElement("option");
  option.value=bone["id"];
  option.className="boneChoice";
  prefix="<span class='prefix'>";
  for (var x of lastChild){
    if (x) {
      prefix+="│";
    }
    else{
      prefix+="⠀";
    }
  }
  lastChild.push(hasLowerSibling(bone));
  if (lastChild[lastChild.length-1]) {
    prefix+="├</span>";
  }
  else{
    prefix+="└</span>";
  }
  li.innerHTML=prefix+`<button onclick="setBone('${bone["id"]}')">${bone["name"]}</button>`;
  prefix.replace("├",">");
  prefix.replace("└",">");
  option.innerHTML=prefix+bone["name"];
  list.appendChild(li);
  selects=document.querySelectorAll(".boneSelector");
  for (var select of selects){
    select.appendChild(option.cloneNode(true));
  }
  if (bone["child_bones"].length>0){
    for (var subBone of bone["child_bones"]){
      updateBoneListPearl(subBone, list, lastChild.slice(0));
    }
  }
}
function getGenerationOf(bone){
  gen=0;
  parentBone=boneList[bone["parent_bone"]];
  while (bone["id"]!=parentBone["id"]){
    gen+=1;
    bone=parentBone;
    parentBone=boneList[bone["parent_bone"]]
  }
  return gen;
}
updateBoneList();
function addBone(){
  var parentId=currentBone["id"];
  var newBone={
    "name":"unnamed",
    "x":800,
    "y":300,
    "CVariance":180,
    "CCVariance":180,
    "child_bones":[],
    "parent_bone":currentBone["id"],
    "id":"#"+boneNum,
  };
  boneNum+=1;
  currentBone["child_bones"].push(newBone);
  boneList[newBone["id"]]=newBone;
  currentBone=newBone;
  document.getElementById("bonename").value=currentBone["name"];
  document.getElementById("boneID").innerHTML=currentBone["id"];
  document.getElementById("bonex").value=currentBone["x"];
  document.getElementById("boney").value=currentBone["y"];
  document.getElementById("clockwise_variance").value=currentBone["CVariance"];
  document.getElementById("counter_clockwise_variance").value=currentBone["CCVariance"];
  document.getElementById("parent_bone").value=parentId;
  updateBoneList();
  drawBone();
}
function setBone(id){
  currentBone=boneList[id];
  document.getElementById("bonename").value=currentBone["name"];
  document.getElementById("boneID").innerHTML=currentBone["id"];
  document.getElementById("bonex").value=currentBone["x"];
  document.getElementById("boney").value=currentBone["y"];
  document.getElementById("clockwise_variance").value=currentBone["CVariance"];
  document.getElementById("counter_clockwise_variance").value=currentBone["CCVariance"];
  document.getElementById("parent_bone").value=currentBone["parent_bone"];
  updateBoneList();
}
function addSplinePoint(){
  
}
function selectBone(){
  
}
function selectSplinePoint(){
  
}
function selectTexture(){
  
}
function hasLowerSibling(bone){
  if (bone["id"]=="#0") return false;
  var siblings=boneList[bone["parent_bone"]]["child_bones"];
  return siblings[siblings.length-1]!=bone;
}
function drawBone(){
  var bone=rootBone;
  var canvas=document.getElementById("editor").getContext("2d");
  canvas.clearRect(0,0,1600,600);
  canvas.strokeStyle="white"
  //circle
  canvas.beginPath();
  canvas.arc(bone["x"],bone["y"],10,0,2*Math.PI);
  canvas.stroke();
  for (var childBone of bone["child_bones"]){
    drawBonePearl(childBone,canvas);
    var angleToChild=Math.atan2(childBone["y"]-bone["y"],childBone["x"]-bone["x"]);
    console.log(angleToChild);
    canvas.beginPath();
    canvas.moveTo(10*Math.cos(angleToChild+Math.PI/2)+bone["x"],10*Math.sin(angleToChild+Math.PI/2)+bone["y"]);
    console.log(10*Math.cos(angleToChild+Math.PI/2)+bone["x"]);
    console.log(10*Math.cos(angleToChild+Math.PI/2));
    console.log(bone["x"]);
    canvas.lineTo(childBone["x"]+10*Math.cos(angleToChild+Math.PI),childBone["y"]+10*Math.sin(angleToChild+Math.PI));
    canvas.stroke();
    canvas.beginPath();
    canvas.moveTo(10*Math.cos(angleToChild-Math.PI/2)+bone["x"],10*Math.sin(angleToChild-Math.PI/2)+bone["y"]);
    canvas.lineTo(childBone["x"]+10*Math.cos(angleToChild+Math.PI),childBone["y"]+10*Math.sin(angleToChild+Math.PI));
    canvas.stroke();
  }
}
function drawBonePearl(bone,canvas){
  canvas.beginPath();
  canvas.arc(bone["x"],bone["y"],10,0,2*Math.PI);
  canvas.stroke();
  for (var childBone of bone["child_bones"]){
    drawBonePearl(childBone);
    var angleToChild=Math.atan2(childBone["y"]-bone["y"],childBone["x"]-bone["x"]);
    canvas.beginPath();
    canvas.moveTo(10*Math.cos(angleToChild+Math.PI/2)+bone["x"],10*Math.sin(angleToChild+Math.PI/2)+bone["y"]);
    canvas.lineTo(childBone["x"]+10*Math.cos(angleToChild+Math.PI),childBone["y"]+10*Math.sin(angleToChild+Math.PI));
    canvas.stroke();
    canvas.beginPath();
    canvas.moveTo(10*Math.cos(angleToChild-Math.PI/2)+bone["x"],10*Math.sin(angleToChild-Math.PI/2)+bone["y"]);
    canvas.lineTo(childBone["x"]+10*Math.cos(angleToChild+Math.PI),childBone["y"]+10*Math.sin(angleToChild+Math.PI));
    canvas.stroke();
  }
}
drawBone();
