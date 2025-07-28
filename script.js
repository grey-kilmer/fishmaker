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
var colorList=["#7F0000","#7F3f00","#7F7F00","#007F00","#00007F","#3f007F"];
var boneNum=1;
var currentBone=rootBone;
var currentTexture={
  "id":"T0",
  "type":0,
  "image":document.createElement("img"),
  "scale":1.0,
  "anchoredTo":"#0",
  "pointsToParent":true,
  "points":[],
  "lineColor":0,
  "lineShade":0,
  "lineOpacity":255,
  "fillColor":0,
  "fillShade":0,
  "fillOpacity":255,
  "loops":true,
};
var textureNum=1;
var zIndex=[currentTexture];
var textures={
  "T0":currentTexture
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
function getColor(id,shade){
  switch (shade){
    case 1: return getLight(colorList[id]); break;
    case 0: return colorList[id]; break;
    case -1: return getDark(colorList[id]); break;
  }
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
function renameBone(){
  currentBone["name"]=document.getElementById("bonename").value;
  updateBoneList();
  updateAllTextures();
}
function reparentBone(){
  var newParentId=document.getElementById("parent_bone").value;
  var childList=boneList[currentBone["parent_bone"]]["child_bones"];
  childList.splice(childList.indexOf(currentBone),1);
  currentBone["parent_bone"]=newParentId;
  boneList[newParentId]["child_bones"].push(currentBone);
  reselect(document.getElementById("parent_bone"),newParentId);
  reselect(document.getElementById("bitmap_bone"),currentBone["id"]);
  updateBoneList();
  updateAllTextures();
  updateBitmapBone();
}
function reparentBonePearl(bone,newParentId){
  var childList=boneList[bone["parent_bone"]]["child_bones"];
  childList.splice(childList.indexOf(bone),1);
  bone["parent_bone"]=newParentId;
  boneList[newParentId]["child_bones"].push(bone);
  updateBoneList();
  updateAllTextures();
}
function updateBonePosition(){
  currentBone["x"]=Number.parseInt(document.getElementById("bonex").value);
  currentBone["y"]=Number.parseInt(document.getElementById("boney").value);
  updateAllTextures();
}
function updateVariance(){
  currentBone["CVariance"]=Number.parseInt(document.getElementById("clockwise_variance").value);
  currentBone["CCVariance"]=Number.parseInt(document.getElementById("counter_clockwise_variance").value);
  updateAllTextures();
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
  reselect(document.getElementById("parent_bone"),parentId);
  reselect(document.getElementById("bitmap_bone"),currentBone["id"]);
  updateAllTextures();
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
  reselect(document.getElementById("bitmap_bone"),currentBone["id"]);
  updateAllTextures();
  updateBitmapBone();
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
  reselect(document.getElementById("bitmap_bone"),currentBone["id"]);
  updateBitmapBone();
}
function addSplinePoint(){
  
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
function updateAllTexturesPearl(bone,canvas){
  canvas.beginPath();
  var radius=10;
  if (bone==currentBone){
    canvas.strokeStyle="#FDD";
    radius=15;
  }
  else{
    canvas.strokeStyle="white";
  }
  canvas.arc(bone["x"],bone["y"],radius,0,2*Math.PI);
  canvas.stroke();
  canvas.strokeStyle="white";
  for (var childBone of bone["child_bones"]){
    updateAllTexturesPearl(childBone,canvas);
    var childRadius=10;
    if (childBone==currentBone){
      childRadius=15;
    }
    var angleToChild=Math.atan2(childBone["y"]-bone["y"],childBone["x"]-bone["x"]);
    canvas.beginPath();
    canvas.moveTo(radius*Math.cos(angleToChild+Math.PI/2)+bone["x"],radius*Math.sin(angleToChild+Math.PI/2)+bone["y"]);
    canvas.lineTo(childBone["x"]+childRadius*Math.cos(angleToChild+Math.PI),childBone["y"]+childRadius*Math.sin(angleToChild+Math.PI));
    canvas.stroke();
    canvas.beginPath();
    canvas.moveTo(radius*Math.cos(angleToChild-Math.PI/2)+bone["x"],radius*Math.sin(angleToChild-Math.PI/2)+bone["y"]);
    canvas.lineTo(childBone["x"]+childRadius*Math.cos(angleToChild+Math.PI),childBone["y"]+childRadius*Math.sin(angleToChild+Math.PI));
    canvas.stroke();
  }
}
updateAllTextures();
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
    updateAllTextures();
    isDraggingBone=true;
    canvas.style.cursor="grabbing";
  }
}
canvas.onmouseup=function(event){
  isDraggingBone=false;
  if (isDraggingBone){
    canvas.style.cursor="grab";
  }
  else {
    canvas.style.cursor="default";
  }
  updateAllTextures();
}
var cooldown=0
canvas.onmousemove=function(event){
  var x=2*parseInt(event.offsetX);
  var y=2*parseInt(event.offsetY);
  if (isDraggingBone){
    document.getElementById("bonex").value=x;
    document.getElementById("boney").value=y;
    currentBone["x"]=x;
    currentBone["y"]=y;
    if (cooldown==0){
      updateAllTextures();
      cooldown=5;
    }
    else {
      cooldown--;
    }
  }
  else {
    if (findBoneAt(x,y)){
      canvas.style.cursor="grab";
    }
    else {
      canvas.style.cursor="default";
    }
  }
}
canvas.onmouseout=function(event){
  isDraggingBone=false;
  canvas.style.cursor="default";
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
    currentTexture["type"]=0;
    for (var input of document.querySelectorAll("#spline input, #spline select")){
      input.disabled=true;
    }
    for (var input of document.querySelectorAll("#bitmap input, #bitmap select")){
      input.disabled=false;
    }
  }
  else {
    currentTexture["type"]=1;
    for (var input of document.querySelectorAll("#spline input, #spline select")){
      input.disabled=false;
    }
    for (var input of document.querySelectorAll("#bitmap input, #bitmap select")){
      input.disabled=true;
    }
  }
}
changeTextureType();
function createTexture(){
  var id="T"+textureNum;
  var newTexture={
    "id":id,
    "type":currentTexture["type"],
    "image":document.createElement("img"),
    "scale":1.0,
    "anchoredTo":currentBone["id"],
    "pointsToParent":true,
    "points":[],
    "lineColor":0,
    "lineShade":0,
    "lineOpacity":255,
    "fillColor":0,
    "fillShade":0,
    "fillOpacity":255,
    "loops":true,
  };
  textureNum++;
  zIndex.push(newTexture);
  textures[id]=newTexture;
  setTexture(id);
  updateAllTextures();
}
function setTexture(id){
  currentTexture=texture["id"];
  
}
function raiseTexture(id){
  var index=zIndex.indexOf(textures[id]);
  if (index>0) {
    var temp=zIndex[index-1];
    zIndex[index-1]=zIndex[index];
    zIndex[index]=temp;
  }
}
function lowerTexture(id){
  var index=zIndex.indexOf(textures[id]);
  if (index<zIndex.length-1) {
    var temp=zIndex[index+1];
    zIndex[index+1]=zIndex[index];
    zIndex[index]=temp;
  }
}
function updateTextureList(){
  var list=document.getElementById("texture_list");
  while (list.childNodes.length>0){
    list.childNodes[0].remove();
  }
  for (var texture of zIndex){
    var li=document.createElement("li");
    li.innerHTML=`<canvas class=textureIcon id=textureIcon${texture["id"]} style=height:50px;width:50px textureid=${texture["id"]}><button onclick="setTexture(${texture["id"]})">texture ${texture["id"]}</button><button onclick="raiseTexture(${texture["id"]})">↑</button><button onclick="lowerTexture(${texture["id"]})">↓</button></li>`;
    list.appendChild(li);
  }
  for (var canvas of document.querySelectorAll(".textureIcon")){
    var texture=textures[canvas.attributes.getNamedItem("textureid").value];
    var context=canvas.getContext("2d");
    if (texture["type"]==0){
      image=texture["image"];
      var width=Math.max(image.width,image.height);
      canvas.width=width;
      canvas.height=width;
      context.drawImage(image,0,0);
    }
    else{
      var x=[];
      var y=[];
      for (var point of texture["points"]){
        x.push(point["x"]);
        y.push(point["y"]);
      }
      var xOffset=min(x);
      var yOffset=min(y);
      var width=max(max(x)-xOffset,max(y)-yOffset);
      canvas.width=width;
      canvas.height=width;
      context.save();
      context.globalAlpha=texture["lineOpacity"]/255;
      context.beginPath();
      context.strokeStyle=getColor(texture["lineColor"],texture["lineShade"]);
      context.lineCap="round";
      firstPoint=texture["points"][0]
      context.moveTo(firstPoint["x"]-xOffset, firstPoint["y"]-yOffset);
      for (var i=1;i<texture["points"].length;i++){
        var point=texture["points"][i];
        context.lineTo(point["x"]-xOffset, point["y"]-yOffset);
      }
      context.lineTo(firstPoint["x"]-xOffset, firstPoint["y"]-yOffset);
      context.stroke();
      context.restore();
      context.save();
      context.globalAlpha=texture["fillOpacity"]/255;
      context.fillStyle=getColor(texture["fillColor"],texture["fillShade"]);
      context.fill();
      context.restore();
    }
  }
}
updateTextureList();
function drawTextureOnCanvas(texture,canvas){
  if (texture["type"]==0){
    var image=texture["image"];
    var anchorBone=boneList[texture["anchoredTo"]];
    var parentBone=boneList[anchorBone["parent_bone"]];
    var angleToParent=Math.atan2(parentBone["y"]-anchorBone["y"],parentBone["x"]-anchorBone["x"]);
    var context=canvas.getContext("2d");
    context.save();
    context.translate(anchorBone["x"],anchorBone["y"]);
    context.scale(texture["scale"],texture["scale"]);
    if (texture["pointsToParent"]){
      context.rotate(angleToParent);
    }
    else{
      context.rotate(angleToParent+Math.PI);
    }
    console.log(image);
    context.drawImage(image,0-Math.round(image.width/2),0-Math.round(image.height/2));
    context.restore();
  }
  else{
    var context=canvas.getContext("2d");
    context.save();
    context.globalAlpha=texture["lineOpacity"]/255;
    context.beginPath();
    context.strokeStyle=getColor(texture["lineColor"],texture["lineShade"]);
    context.lineCap="round";
    firstPoint=texture["points"][0]
    context.moveTo(firstPoint["x"], firstPoint["y"]);
    for (var i=1;i<texture["points"].length;i++){
      var point=texture["points"][i];
      context.lineTo(point["x"], point["y"]);
    }
    if (texture["loops"]) context.lineTo(firstPoint["x"], firstPoint["y"]);
    context.stroke();
    context.restore();
    context.save();
    context.globalAlpha=texture["fillOpacity"]/255;
    context.fillStyle=getColor(texture["fillColor"],texture["fillShade"]);
    context.fill();
    context.restore();
  }
}
function updateAllTextures(){
  var bone=rootBone;
  var canvas=document.getElementById("editor").getContext("2d");
  canvas.clearRect(0,0,1600,600);
  canvas.beginPath();
  var radius=10;
  if (bone==currentBone){
    canvas.strokeStyle="#FDD";
    radius=15;
  }
  else{
    canvas.strokeStyle="white";
  }
  canvas.arc(bone["x"],bone["y"],radius,0,2*Math.PI);
  canvas.stroke();
  canvas.strokeStyle="white";
  for (var childBone of bone["child_bones"]){
    updateAllTexturesPearl(childBone,canvas);
    var childRadius=10;
    if (childBone==currentBone){
      childRadius=15;
    }
    var angleToChild=Math.atan2(childBone["y"]-bone["y"],childBone["x"]-bone["x"]);
    canvas.beginPath();
    canvas.moveTo(radius*Math.cos(angleToChild+Math.PI/2)+bone["x"],radius*Math.sin(angleToChild+Math.PI/2)+bone["y"]);
    canvas.lineTo(childBone["x"]+childRadius*Math.cos(angleToChild+Math.PI),childBone["y"]+childRadius*Math.sin(angleToChild+Math.PI));
    canvas.stroke();
    canvas.beginPath();
    canvas.moveTo(radius*Math.cos(angleToChild-Math.PI/2)+bone["x"],radius*Math.sin(angleToChild-Math.PI/2)+bone["y"]);
    canvas.lineTo(childBone["x"]+childRadius*Math.cos(angleToChild+Math.PI),childBone["y"]+childRadius*Math.sin(angleToChild+Math.PI));
    canvas.stroke();
  }
  for (textureID in textures){
    drawTextureOnCanvas(textures[textureID],document.getElementById("editor"));
  }
}
function updateBitmapBone(){
  currentTexture["anchoredTo"]=document.getElementById("bitmap_bone").value;
  updateAllTextures();
}
function updateScale(){
  currentTexture["scale"]=document.getElementById("bitmap_scale").value/100;
  updateAllTextures();
}
function importTexture(){
  var imageElement=currentTexture["image"];
  var image=document.getElementById("texture_import").files[0];
  var reader = new FileReader();
  reader.addEventListener("load",()=>{
    imageElement.src=reader.result;
    document.getElementById("texture_import").style.backgroundImage="url("+reader.result+")";
    if (Math.min(imageElement.width,imageElement.height)<100){
      document.getElementById("texture_import").style.imageRendering="pixelated";
    }
    else{
      document.getElementById("texture_import").style.imageRendering="auto";
    }
    updateAllTextures();
    updateTextureList();
  },false,);
  if (image) {
    reader.readAsDataURL(image);
  }
}
