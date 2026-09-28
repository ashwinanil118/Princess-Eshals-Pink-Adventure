const c=document.getElementById("game"),x=c.getContext("2d");
const music=document.getElementById("music"),start=document.getElementById("start"),end=document.getElementById("end");
const W=5600,H=720,ground=610; let cam=0,hearts=0,won=false;
const keys={}; addEventListener("keydown",e=>{keys[e.key.toLowerCase()]=true;if([" ","arrowup","arrowdown","arrowleft","arrowright"].includes(e.key.toLowerCase()))e.preventDefault()});
addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);
const P={x:100,y:500,w:48,h:70,vx:0,vy:0,on:false,crouch:false};
const plats=[
[0,610,780,110],[900,610,620,110],[1660,610,720,110],[2500,610,580,110],[3210,610,720,110],[4080,610,620,110],[4820,610,780,110],
[340,500,180,24],[620,420,170,24],[1020,500,180,24],[1280,390,170,24],[1740,490,170,24],[2010,390,180,24],[2620,490,180,24],[2870,390,160,24],
[3300,500,190,24],[3590,410,170,24],[4140,490,180,24],[4440,390,170,24],[4930,500,180,24],[5200,410,180,24]];
const heartPos=[[220,540],[400,440],[680,360],[960,540],[1080,440],[1340,330],[1740,430],[2070,330],[2260,540],[2600,540],[2680,430],
[2920,330],[3260,540],[3370,440],[3650,350],[4070,540],[4210,430],[4500,330],[4870,540],[4990,440],[5260,350],[5480,540]];
let hs=heartPos.map((p,i)=>({x:p[0],y:p[1],got:false,t:i}));
function reset(){P.x=100;P.y=500;P.vx=P.vy=0;cam=0;hearts=0;won=false;hs.forEach(h=>h.got=false);end.classList.add("hidden")}
function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function heartShape(cx,cy,s,fill){x.save();x.translate(cx,cy);x.scale(s,s);x.beginPath();x.moveTo(0,8);x.bezierCurveTo(-28,-10,-24,-35,0,-24);x.bezierCurveTo(24,-35,28,-10,0,8);x.fillStyle=fill;x.fill();x.restore()}
function cloud(px,py,s){x.fillStyle="#fff8fc";for(const [a,b,r] of [[0,15,28],[28,0,38],[64,14,30],[32,24,45]]){x.beginPath();x.arc(px+a*s,py+b*s,r*s,0,7);x.fill()}}
function drawBg(){
 let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,"#ffd5e7");g.addColorStop(.55,"#f9c4dc");g.addColorStop(1,"#f3afd0");x.fillStyle=g;x.fillRect(0,0,c.width,H);
 x.fillStyle="#f7b8d5";for(let i=0;i<10;i++){let px=((i*360-cam*.15)%1700+1700)%1700-200;x.beginPath();x.arc(px,590,260,Math.PI,0);x.fill()}
 cloud(100-(cam*.08%1500),100,1);cloud(650-(cam*.12%1700),155,.8);cloud(1100-(cam*.06%1800),75,.65);
 for(let i=0;i<28;i++){let px=((i*220-cam*.35)%1700+1700)%1700-100;x.fillStyle="#d98ab0";x.fillRect(px,500,12,110);x.fillStyle="#ef9fc1";x.beginPath();x.arc(px+6,485,35,0,7);x.fill()}
}
function drawWorld(){
 x.save();x.translate(-cam,0);
 for(const p of plats){x.fillStyle="#c96894";x.fillRect(...p);x.fillStyle="#f59fc0";x.fillRect(p[0],p[1],p[2],12);
  for(let j=20;j<p[2];j+=55){x.fillStyle="#ffe7f1";x.beginPath();x.arc(p[0]+j,p[1]+6,5,0,7);x.fill()}}
 // flowers
 for(let q=80;q<W;q+=150){if(plats.some(p=>q>=p[0]&&q<=p[0]+p[2]&&p[1]===610)){x.strokeStyle="#9b6680";x.lineWidth=4;x.beginPath();x.moveTo(q,610);x.lineTo(q,580);x.stroke();heartShape(q,572,.38,"#fff2f8")}}
 // castle
 x.fillStyle="#fff0f7";x.fillRect(5350,400,210,210);x.fillStyle="#e886ae";x.fillRect(5380,350,55,260);x.fillRect(5475,330,55,280);
 x.fillStyle="#bd557f";x.beginPath();x.moveTo(5370,350);x.lineTo(5408,300);x.lineTo(5445,350);x.fill();x.beginPath();x.moveTo(5465,330);x.lineTo(5503,275);x.lineTo(5540,330);x.fill();
 x.fillStyle="#bd557f";x.fillRect(5425,500,65,110);heartShape(5457,455,.8,"#ef78a6");
 // hearts
 for(const h of hs)if(!h.got){let bob=Math.sin(performance.now()/300+h.t)*6;heartShape(h.x,h.y+bob,.72,"#ed6d9e");heartShape(h.x,h.y+bob,.48,"#ffd9e9")}
 // player
 const ph=P.crouch?45:70, py=P.crouch?P.y+25:P.y;
 x.fillStyle="#7c4d68";x.beginPath();x.arc(P.x+24,py+18,22,0,7);x.fill(); // hair
 x.fillStyle="#ffd9ca";x.beginPath();x.arc(P.x+24,py+20,17,0,7);x.fill(); // face
 x.fillStyle="#5b4050";x.beginPath();x.arc(P.x+18,py+18,2,0,7);x.arc(P.x+30,py+18,2,0,7);x.fill();
 x.fillStyle="#f28db6";x.fillRect(P.x+8,py+35,32,ph-35);x.fillStyle="#fff1f7";x.fillRect(P.x+10,py+45,28,8);
 x.restore();
}
function hud(){x.fillStyle="#fff7fbdd";x.fillRect(24,22,205,64);x.strokeStyle="#e487ad";x.lineWidth=3;x.strokeRect(24,22,205,64);heartShape(55,54,.55,"#eb6b9c");x.fillStyle="#a44c73";x.font="bold 26px Arial";x.fillText(`${hearts} / 22`,82,63)}
function update(){
 if(won)return;
 let left=keys["a"]||keys["arrowleft"],right=keys["d"]||keys["arrowright"],jump=keys["w"]||keys["arrowup"]||keys[" "],down=keys["s"]||keys["arrowdown"];
 P.crouch=!!down&&P.on; let accel=P.crouch?.35:.75,max=P.crouch?2.2:6;
 if(left)P.vx=Math.max(P.vx-accel,-max);if(right)P.vx=Math.min(P.vx+accel,max);if(!left&&!right)P.vx*=.80;
 if(jump&&P.on&&!P.crouch&&!P.jumpLock){P.vy=-13.8;P.on=false;P.jumpLock=true} if(!jump)P.jumpLock=false;
 P.vy+=.72;P.vy=Math.min(P.vy,16); let oldY=P.y;P.x+=P.vx;P.x=Math.max(0,Math.min(W-P.w,P.x));P.y+=P.vy;P.on=false;
 let box={x:P.x,y:P.y,w:P.w,h:P.crouch?45:P.h};
 for(const p of plats){let pb={x:p[0],y:p[1],w:p[2],h:p[3]};if(overlap(box,pb)&&P.vy>=0&&oldY+(P.crouch?45:P.h)<=p[1]+12){
   if(down&&p[1]<600){P.y=p[1]+18;P.vy=2}else{P.y=p[1]-(P.crouch?45:P.h);P.vy=0;P.on=true}
 }}
 if(P.y>760){P.x=Math.max(40,P.x-260);P.y=420;P.vx=P.vy=0}
 for(const h of hs)if(!h.got&&Math.hypot(P.x+24-h.x,P.y+35-h.y)<48){h.got=true;hearts++}
 if(P.x>5320&&hearts===22){won=true;setTimeout(()=>end.classList.remove("hidden"),450)}
 cam+=(Math.max(0,Math.min(W-c.width,P.x-c.width*.38))-cam)*.09;
}
function loop(){drawBg();update();drawWorld();hud();requestAnimationFrame(loop)}loop();
document.getElementById("play").onclick=()=>{start.classList.add("hidden");music.volume=.28;music.play().catch(()=>{})};
document.getElementById("again").onclick=()=>{reset();music.currentTime=0;music.play().catch(()=>{})};
