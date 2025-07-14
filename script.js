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
var colorList=["#000000","#000000","#000000","#000000","#000000","#000000"];
var boneNum=1;
var currentBone=rootBone;
var importTextures=[];
var textures={};
var currentTexture={
  "id":"t0",
  "type":0,
  "texture":0,
  "anchoredTo":"#0",
  "point":3
};
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
function reselect(select, value){
  for (var option of select.querySelectorAll("option")){
    if (option.value==value){
      console.log("FOUND");
      option.selected=true;
      return
    }
  }
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
function reparentBone(){
  var newParentId=document.getElementById("parent_bone").value;
  var childList=boneList[currentBone["parent_bone"]]["child_bones"];
  childList.splice(childList.indexOf(currentBone),1);
  currentBone["parent_bone"]=newParentId;
  boneList[newParentId]["child_bones"].push(currentBone);
  updateBoneList();
  drawBone();
  reselect(document.getElementById("parent_bone"),newParentId);
}
function reparentBonePearl(bone,newParentId){
  var childList=boneList[bone["parent_bone"]]["child_bones"];
  childList.splice(childList.indexOf(bone),1);
  bone["parent_bone"]=newParentId;
  boneList[newParentId]["child_bones"].push(bone);
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
  updateBoneList();
  drawBone();
  reselect(document.getElementById("parent_bone"),parentId);
}
function deleteBone(){
  var parentId=currentBone["parent_bone"]
  document.getElementById("parent_bone").value=parentId;
  var childList=boneList[parentId]["child_bones"];
  childList.splice(childList.indexOf(currentBone),1);
  for (child of currentBone["child_bones"]){
    reparentBone(child,parentId);
  }
  setBone(parentId);
  updateBoneList();
  reselect(document.getElementById("parent_bone"),boneList[parentId]["parent_id"]);
} 
function setBone(id){
  currentBone=boneList[id];
  document.getElementById("bonename").value=currentBone["name"];
  document.getElementById("boneID").innerHTML=currentBone["id"];
  document.getElementById("bonex").value=currentBone["x"];
  document.getElementById("boney").value=currentBone["y"];
  document.getElementById("clockwise_variance").value=currentBone["CVariance"];
  document.getElementById("counter_clockwise_variance").value=currentBone["CCVariance"];
  updateBoneList();
  reselect(document.getElementById("parent_bone"),currentBone["parent_bone"]);
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
    drawBonePearl(childBone,canvas);
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
var canvas=document.getElementById("editor");
var isDraggingBone=false;
function findBoneAt(x,y){
  for (var boneId in boneList){
    var bone=boneList[boneId];
    if (Math.abs(bone["x"]-x)<20&&Math.abs(bone["y"]-y)<20){
      return bone;
    }
  }
}
canvas.onmousedown=function(event){
  var x=2*parseInt(event.offsetX);
  var y=2*parseInt(event.offsetY);
  var bone=findBoneAt(x,y);
  if (bone){
    setBone(bone["id"]);
    isDraggingBone=true;
  }
}
canvas.onmouseup=function(event){
  if (isDraggingBone){
    var x=2*parseInt(event.offsetX);
    var y=2*parseInt(event.offsetY);
    if (Math.abs(currentBone["x"]-x)>2&&Math.abs(currentBone["y"]-y)>2){
      document.getElementById("bonex").value=x;
      document.getElementById("boney").value=y;
      currentBone["x"]=x;
      currentBone["y"]=y;
      drawBone();
    }
  }
  isDraggingBone=false;
}
canvas.onmouseout=function(event){
  isDraggingBone=false;
}
function decimaltoHex(num){
  if (num>=255){return "FF";}
  var hexal=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
  return hexal[Math.floor(num/16)]+hexal[Math.floor(num%16)];
}
function getLight(color){
  var r=("0x"+color.slice(1,3))*1;
  var g=("0x"+color.slice(3,5))*1;
  var b=("0x"+color.slice(5,7))*1;
  return "#"+decimaltoHex(r*1.3)+decimaltoHex(g*1.3)+decimaltoHex(b*1.3)
}
function getDark(color){
  var r=("0x"+color.slice(1,3))*1;
  var g=("0x"+color.slice(3,5))*1;
  var b=("0x"+color.slice(5,7))*1;
  return "#"+decimaltoHex(r*0.7)+decimaltoHex(g*0.7)+decimaltoHex(b*0.7)
}
function updateColor(colNum){
  var color=document.querySelector("#picker"+colNum+" input").value;
  colorList[colNum]=color;
  document.querySelector("#light"+colNum+" input").value=getLight(color);
  document.querySelector("#dark"+colNum+" input").value=getDark(color);
}
for (var i=0;i<6;i++){
  updateColor(i);
}
function changeTextureType(){
  if (document.getElementById("texture_type").value==0){
    currentTexture["type"]=0
    for (var input of document.querySelectorAll("#spline input")){
      input.disabled=true;
    }
  }
  else{
    currentTexture["type"]=1
    for (var input of document.querySelectorAll("#bitmap input")){
      input.disabled=true;
    }
  }
}
changeTextureType();
