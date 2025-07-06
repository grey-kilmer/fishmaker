var name="";
var rootBone={
  "name":"root",
  "x":0,
  "y":0,
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
}
function updateBonePosition(){
  currentBone["x"]=document.getElementById("bonex").value;
  currentBone["y"]=document.getElementById("boney").value;
}
function updateVariance(){
  currentBone["CVariance"]=document.getElementById("clockwise_variance").value;
  currentBone["CCVariance"]=document.getElementById("counter_clockwise_variance").value;
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
  var list=document.getElementById("bone_chain");
  for (var child of list.childNodes){
    child.remove();
  }
  for (var option of document.querySelectorAll(".boneChoice")){
    option.remove();
  }
  updateBoneListPearl(rootBone,list);
}
function updateBoneListPearl(bone, list){
  var li=document.createElement("li");
  var option=document.createElement("option");
  li.innerHTML=`<button onclick="setBone('${bone["id"]}')">${bone["name"]}</button>`;
  option.value=bone["id"];
  option.className="boneChoice";
  prefix="";
  for (var i=0;i<getGenerationOf(bone);i++){prefix+="║";}
  prefix+="╟";
  option.innerHTML=prefix+bone["name"]
  list.appendChild(li);
  selects=document.querySelectorAll(".boneSelector");
  for (var select of selects){
    select.appendChild(option.cloneNode(true));
  }
  if (bone["child_bones"].length>0){
    newList=document.createElement("ul");
    list.appendChild(newList);
    for (var subBone of bone["child_bones"]){
      updateBoneListPearl(subBone, newList);
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
    "x":0,
    "y":0,
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
  document.getElementById("bonename").value="unnamed";
  document.getElementById("boneID").innerHTML=currentBone["id"];
  document.getElementById("bonex").value=0;
  document.getElementById("boney").value=0;
  document.getElementById("clockwise_variance").value=180;
  document.getElementById("counter_clockwise_variance").value=180;
  document.getElementById("parent_bone").value=parentId;
  updateBoneList();
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
