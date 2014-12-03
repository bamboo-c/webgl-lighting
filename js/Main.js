var Main={canvas:null,gl:null,vScript:null,fScript:null,vShader:null,fShader:null,vbo:null,ibo:null,shader:null,program:null,torusData:null,vPosition:null,vColor:null,vNormal:null,index:null,matrix:null,vMatrix:null,pMatrix:null,vpMatrix:null,mvpMatrix:null,invMatrix:null,lightDirection:null,count:null,run:null,attLocation:null,attStride:null,uniLocation:null,init:function(){window.addEventListener("keydown",function(t){run=27!==t.keyCode},!0),canvas=document.getElementById("canvas"),canvas.width,canvas.height,gl=canvas.getContext("webgl")||canvas.getContext("experimental-webgl"),vScript=document.getElementById("vs").textContent,fScript=document.getElementById("fs").textContent,vShader=this._createShader(vScript,gl.VERTEX_SHADER),fShader=this._createShader(fScript,gl.FRAGMENT_SHADER),prg=this._createProgram(vShader,fShader),attLocation=[],attLocation[0]=gl.getAttribLocation(prg,"position"),attLocation[1]=gl.getAttribLocation(prg,"normal"),attLocation[2]=gl.getAttribLocation(prg,"color"),attStride=[],attStride[0]=3,attStride[1]=3,attStride[2]=4,uniLocation=[],uniLocation[0]=gl.getUniformLocation(prg,"mvpMatrix"),uniLocation[1]=gl.getUniformLocation(prg,"invMatrix"),uniLocation[2]=gl.getUniformLocation(prg,"lightDirection"),torusData=torus(64,64,.25,.75),vPosition=torusData.p,vColor=torusData.c,vNormal=torusData.n,index=torusData.i,attVBO=[],attVBO[0]=this._createVbo(vPosition),attVBO[1]=this._createVbo(vNormal),attVBO[2]=this._createVbo(vColor),this._setAttribute(attVBO,attLocation,attStride),ibo=this._createIbo(index),gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo),matrix=new matIV,mMatrix=matrix.identity(matrix.create()),vMatrix=matrix.identity(matrix.create()),pMatrix=matrix.identity(matrix.create()),vpMatrix=matrix.identity(matrix.create()),mvpMatrix=matrix.identity(matrix.create()),invMatrix=matrix.identity(matrix.create()),gl.viewport(0,0,canvas.width,canvas.height),matrix.lookAt([0,0,5],[0,0,0],[0,1,0],vMatrix),matrix.perspective(45,canvas.width/canvas.height,.1,10,pMatrix),matrix.multiply(pMatrix,vMatrix,vpMatrix),gl.clearColor(0,0,0,1),gl.clearDepth(1),gl.enable(gl.DEPTH_TEST),gl.depthFunc(gl.LEQUAL),gl.enable(gl.CULL_FACE),lightDirection=[.577,.577,.577],count=0,run=!0,this._render(run)},_createShader:function(t,r){return shader=gl.createShader(r),gl.shaderSource(shader,t),gl.compileShader(shader),gl.getShaderParameter(shader,gl.COMPILE_STATUS)?shader:(console.log(gl.getShaderInfoLog(shader)),null)},_createProgram:function(t,r){return program=gl.createProgram(),gl.attachShader(program,t),gl.attachShader(program,r),gl.linkProgram(program),gl.getProgramParameter(program,gl.LINK_STATUS)?(gl.useProgram(program),program):(console.log(gl.getProgramInfoLog(program)),null)},_createVbo:function(t){return vbo=gl.createBuffer(),gl.bindBuffer(gl.ARRAY_BUFFER,vbo),gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(t),gl.STATIC_DRAW),gl.bindBuffer(gl.ARRAY_BUFFER,null),vbo},_createIbo:function(t){return ibo=gl.createBuffer(),gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo),gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Int16Array(t),gl.STATIC_DRAW),gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null),ibo},_setAttribute:function(t,r,a){for(var i in t)gl.bindBuffer(gl.ARRAY_BUFFER,t[i]),gl.enableVertexAttribArray(r[i]),gl.vertexAttribPointer(r[i],a[i],gl.FLOAT,!1,0,0)},_render:function(){count++;var t=count%360*Math.PI/180;gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT),matrix.identity(mMatrix),matrix.rotate(mMatrix,t,[0,1,1],mMatrix),matrix.multiply(vpMatrix,mMatrix,mvpMatrix),matrix.inverse(mMatrix,invMatrix),gl.uniformMatrix4fv(uniLocation[0],!1,mvpMatrix),gl.uniformMatrix4fv(uniLocation[1],!1,invMatrix),gl.uniform3fv(uniLocation[2],lightDirection),gl.drawElements(gl.TRIANGLES,index.length,gl.UNSIGNED_SHORT,0),gl.flush(),run&&requestAnimationFrame(this._render.bind(this))}};window.onload=function(){Main.init()};
function matIV(){this.create=function(){return new Float32Array(16)},this.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},this.multiply=function(t,r,n){var a=t[0],i=t[1],s=t[2],e=t[3],h=t[4],u=t[5],o=t[6],c=t[7],f=t[8],v=t[9],M=t[10],p=t[11],l=t[12],y=t[13],A=t[14],w=t[15],I=r[0],q=r[1],m=r[2],P=r[3],V=r[4],d=r[5],b=r[6],g=r[7],F=r[8],k=r[9],z=r[10],j=r[11],x=r[12],B=r[13],C=r[14],D=r[15];return n[0]=I*a+q*h+m*f+P*l,n[1]=I*i+q*u+m*v+P*y,n[2]=I*s+q*o+m*M+P*A,n[3]=I*e+q*c+m*p+P*w,n[4]=V*a+d*h+b*f+g*l,n[5]=V*i+d*u+b*v+g*y,n[6]=V*s+d*o+b*M+g*A,n[7]=V*e+d*c+b*p+g*w,n[8]=F*a+k*h+z*f+j*l,n[9]=F*i+k*u+z*v+j*y,n[10]=F*s+k*o+z*M+j*A,n[11]=F*e+k*c+z*p+j*w,n[12]=x*a+B*h+C*f+D*l,n[13]=x*i+B*u+C*v+D*y,n[14]=x*s+B*o+C*M+D*A,n[15]=x*e+B*c+C*p+D*w,n},this.scale=function(t,r,n){return n[0]=t[0]*r[0],n[1]=t[1]*r[0],n[2]=t[2]*r[0],n[3]=t[3]*r[0],n[4]=t[4]*r[1],n[5]=t[5]*r[1],n[6]=t[6]*r[1],n[7]=t[7]*r[1],n[8]=t[8]*r[2],n[9]=t[9]*r[2],n[10]=t[10]*r[2],n[11]=t[11]*r[2],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15],n},this.translate=function(t,r,n){return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n[9]=t[9],n[10]=t[10],n[11]=t[11],n[12]=t[0]*r[0]+t[4]*r[1]+t[8]*r[2]+t[12],n[13]=t[1]*r[0]+t[5]*r[1]+t[9]*r[2]+t[13],n[14]=t[2]*r[0]+t[6]*r[1]+t[10]*r[2]+t[14],n[15]=t[3]*r[0]+t[7]*r[1]+t[11]*r[2]+t[15],n},this.rotate=function(t,r,n,a){var i=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);if(!i)return null;var s=n[0],e=n[1],h=n[2];1!=i&&(i=1/i,s*=i,e*=i,h*=i);var u=Math.sin(r),o=Math.cos(r),c=1-o,f=t[0],v=t[1],M=t[2],p=t[3],l=t[4],y=t[5],A=t[6],w=t[7],I=t[8],q=t[9],m=t[10],P=t[11],V=s*s*c+o,d=e*s*c+h*u,b=h*s*c-e*u,g=s*e*c-h*u,F=e*e*c+o,k=h*e*c+s*u,z=s*h*c+e*u,j=e*h*c-s*u,x=h*h*c+o;return r?t!=a&&(a[12]=t[12],a[13]=t[13],a[14]=t[14],a[15]=t[15]):a=t,a[0]=f*V+l*d+I*b,a[1]=v*V+y*d+q*b,a[2]=M*V+A*d+m*b,a[3]=p*V+w*d+P*b,a[4]=f*g+l*F+I*k,a[5]=v*g+y*F+q*k,a[6]=M*g+A*F+m*k,a[7]=p*g+w*F+P*k,a[8]=f*z+l*j+I*x,a[9]=v*z+y*j+q*x,a[10]=M*z+A*j+m*x,a[11]=p*z+w*j+P*x,a},this.lookAt=function(t,r,n,a){var i=t[0],s=t[1],e=t[2],h=n[0],u=n[1],o=n[2],c=r[0],f=r[1],v=r[2];if(i==c&&s==f&&e==v)return this.identity(a);var M,p,l,y,A,w,I,q,m,P;return I=i-r[0],q=s-r[1],m=e-r[2],P=1/Math.sqrt(I*I+q*q+m*m),I*=P,q*=P,m*=P,M=u*m-o*q,p=o*I-h*m,l=h*q-u*I,P=Math.sqrt(M*M+p*p+l*l),P?(P=1/P,M*=P,p*=P,l*=P):(M=0,p=0,l=0),y=q*l-m*p,A=m*M-I*l,w=I*p-q*M,P=Math.sqrt(y*y+A*A+w*w),P?(P=1/P,y*=P,A*=P,w*=P):(y=0,A=0,w=0),a[0]=M,a[1]=y,a[2]=I,a[3]=0,a[4]=p,a[5]=A,a[6]=q,a[7]=0,a[8]=l,a[9]=w,a[10]=m,a[11]=0,a[12]=-(M*i+p*s+l*e),a[13]=-(y*i+A*s+w*e),a[14]=-(I*i+q*s+m*e),a[15]=1,a},this.perspective=function(t,r,n,a,i){var s=n*Math.tan(t*Math.PI/360),e=s*r,h=2*e,u=2*s,o=a-n;return i[0]=2*n/h,i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[5]=2*n/u,i[6]=0,i[7]=0,i[8]=0,i[9]=0,i[10]=-(a+n)/o,i[11]=-1,i[12]=0,i[13]=0,i[14]=-(a*n*2)/o,i[15]=0,i},this.ortho=function(t,r,n,a,i,s,e){var h=r-t,u=n-a,o=s-i;return e[0]=2/h,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=2/u,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=-2/o,e[11]=0,e[12]=-(t+r)/h,e[13]=-(n+a)/u,e[14]=-(s+i)/o,e[15]=1,e},this.transpose=function(t,r){return r[0]=t[0],r[1]=t[4],r[2]=t[8],r[3]=t[12],r[4]=t[1],r[5]=t[5],r[6]=t[9],r[7]=t[13],r[8]=t[2],r[9]=t[6],r[10]=t[10],r[11]=t[14],r[12]=t[3],r[13]=t[7],r[14]=t[11],r[15]=t[15],r},this.inverse=function(t,r){var n=t[0],a=t[1],i=t[2],s=t[3],e=t[4],h=t[5],u=t[6],o=t[7],c=t[8],f=t[9],v=t[10],M=t[11],p=t[12],l=t[13],y=t[14],A=t[15],w=n*h-a*e,I=n*u-i*e,q=n*o-s*e,m=a*u-i*h,P=a*o-s*h,V=i*o-s*u,d=c*l-f*p,b=c*y-v*p,g=c*A-M*p,F=f*y-v*l,k=f*A-M*l,z=v*A-M*y,j=1/(w*z-I*k+q*F+m*g-P*b+V*d);return r[0]=(h*z-u*k+o*F)*j,r[1]=(-a*z+i*k-s*F)*j,r[2]=(l*V-y*P+A*m)*j,r[3]=(-f*V+v*P-M*m)*j,r[4]=(-e*z+u*g-o*b)*j,r[5]=(n*z-i*g+s*b)*j,r[6]=(-p*V+y*q-A*I)*j,r[7]=(c*V-v*q+M*I)*j,r[8]=(e*k-h*g+o*d)*j,r[9]=(-n*k+a*g-s*d)*j,r[10]=(p*P-l*q+A*w)*j,r[11]=(-c*P+f*q-M*w)*j,r[12]=(-e*F+h*b-u*d)*j,r[13]=(n*F-a*b+i*d)*j,r[14]=(-p*m+l*I-y*w)*j,r[15]=(c*m-f*I+v*w)*j,r}}function qtnIV(){this.create=function(){return new Float32Array(4)},this.identity=function(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t},this.inverse=function(t,r){return r[0]=-t[0],r[1]=-t[1],r[2]=-t[2],r[3]=t[3],r},this.normalize=function(t){var r=t[0],n=t[1],a=t[2],i=t[3],s=Math.sqrt(r*r+n*n+a*a+i*i);return 0===s?(t[0]=0,t[1]=0,t[2]=0,t[3]=0):(s=1/s,t[0]=r*s,t[1]=n*s,t[2]=a*s,t[3]=i*s),t},this.multiply=function(t,r,n){var a=t[0],i=t[1],s=t[2],e=t[3],h=r[0],u=r[1],o=r[2],c=r[3];return n[0]=a*c+e*h+i*o-s*u,n[1]=i*c+e*u+s*h-a*o,n[2]=s*c+e*o+a*u-i*h,n[3]=e*c-a*h-i*u-s*o,n},this.rotate=function(t,r,n){var a=Math.sqrt(r[0]*r[0]+r[1]*r[1]+r[2]*r[2]);if(!a)return null;var i=r[0],s=r[1],e=r[2];1!=a&&(a=1/a,i*=a,s*=a,e*=a);var h=Math.sin(.5*t);return n[0]=i*h,n[1]=s*h,n[2]=e*h,n[3]=Math.cos(.5*t),n},this.toVecIII=function(t,r,n){var a=this.create(),i=this.create(),s=this.create();return this.inverse(r,s),a[0]=t[0],a[1]=t[1],a[2]=t[2],this.multiply(s,a,i),this.multiply(i,r,s),n[0]=s[0],n[1]=s[1],n[2]=s[2],n},this.toMatIV=function(t,r){var n=t[0],a=t[1],i=t[2],s=t[3],e=n+n,h=a+a,u=i+i,o=n*e,c=n*h,f=n*u,v=a*h,M=a*u,p=i*u,l=s*e,y=s*h,A=s*u;return r[0]=1-(v+p),r[1]=c-A,r[2]=f+y,r[3]=0,r[4]=c+A,r[5]=1-(o+p),r[6]=M-l,r[7]=0,r[8]=f-y,r[9]=M+l,r[10]=1-(o+v),r[11]=0,r[12]=0,r[13]=0,r[14]=0,r[15]=1,r},this.slerp=function(t,r,n,a){var i=t[0]*r[0]+t[1]*r[1]+t[2]*r[2]+t[3]*r[3],s=1-i*i;if(0>=s)a[0]=t[0],a[1]=t[1],a[2]=t[2],a[3]=t[3];else if(s=Math.sqrt(s),Math.abs(s)<1e-4)a[0]=.5*t[0]+.5*r[0],a[1]=.5*t[1]+.5*r[1],a[2]=.5*t[2]+.5*r[2],a[3]=.5*t[3]+.5*r[3];else{var e=Math.acos(i),h=e*n,u=Math.sin(e-h)/s,o=Math.sin(h)/s;a[0]=t[0]*u+r[0]*o,a[1]=t[1]*u+r[1]*o,a[2]=t[2]*u+r[2]*o,a[3]=t[3]*u+r[3]*o}return a}}function torus(t,r,n,a,i){var s,e,h,u=new Array,o=new Array,c=new Array,f=new Array,v=new Array;for(s=0;t>=s;s++){var M=2*Math.PI/t*s,p=Math.cos(M),l=Math.sin(M);for(e=0;r>=e;e++){var y=2*Math.PI/r*e,A=(p*n+a)*Math.cos(y),w=l*n,I=(p*n+a)*Math.sin(y),q=p*Math.cos(y),m=p*Math.sin(y);h=i?i:hsva(360/r*e,1,1,1);var P=1/r*e,V=1/t*s+.5;V>1&&(V-=1),V=1-V,u.push(A,w,I),o.push(q,l,m),c.push(h[0],h[1],h[2],h[3]),f.push(P,V)}}for(s=0;t>s;s++)for(e=0;r>e;e++)M=(r+1)*s+e,v.push(M,M+r+1,M+1),v.push(M+r+1,M+r+2,M+1);return{p:u,n:o,c:c,t:f,i:v}}function sphere(t,r,n,a){var i,s,e,h=new Array,u=new Array,o=new Array,c=new Array,f=new Array;for(i=0;t>=i;i++){var v=Math.PI/t*i,M=Math.cos(v),p=Math.sin(v);for(s=0;r>=s;s++){var l=2*Math.PI/r*s,y=p*n*Math.cos(l),A=M*n,w=p*n*Math.sin(l),I=p*Math.cos(l),q=p*Math.sin(l);e=a?a:hsva(360/t*i,1,1,1),h.push(y,A,w),u.push(I,M,q),o.push(e[0],e[1],e[2],e[3]),c.push(1-1/r*s,1/t*i)}}for(v=0,i=0;t>i;i++)for(s=0;r>s;s++)v=(r+1)*i+s,f.push(v,v+1,v+r+2),f.push(v,v+r+2,v+r+1);return{p:h,n:u,c:o,t:c,i:f}}function cube(t,r){for(var n,a=.5*t,i=[-a,-a,a,a,-a,a,a,a,a,-a,a,a,-a,-a,-a,-a,a,-a,a,a,-a,a,-a,-a,-a,a,-a,-a,a,a,a,a,a,a,a,-a,-a,-a,-a,a,-a,-a,a,-a,a,-a,-a,a,a,-a,-a,a,a,-a,a,a,a,a,-a,a,-a,-a,-a,-a,-a,a,-a,a,a,-a,a,-a],s=[-1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1],e=new Array,h=0;h<i.length/3;h++)n=r?r:hsva(360/i.length/3*h,1,1,1),e.push(n[0],n[1],n[2],n[3]);var u=[0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1],o=[0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23];return{p:i,n:s,c:e,t:u,i:o}}function hsva(t,r,n,a){if(!(r>1||n>1||a>1)){var i=t%360,s=Math.floor(i/60),e=i/60-s,h=n*(1-r),u=n*(1-r*e),o=n*(1-r*(1-e)),c=new Array;if(!r>0&&0>!r)c.push(n,n,n,a);else{var f=new Array(n,u,h,h,o,n),v=new Array(o,n,n,u,h,h),M=new Array(h,h,o,n,n,u);c.push(f[s],v[s],M[s],a)}return c}}