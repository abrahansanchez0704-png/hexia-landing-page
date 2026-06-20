import { useEffect, useRef } from 'react';

const vs = `#version 300 es
precision highp float;
in vec4 p;
void main(){gl_Position=p;}`;

const fs = `#version 300 es
precision highp float;
out vec4 O;
uniform float t;
uniform vec2 r;
#define FC gl_FragCoord.xy
#define R r
#define T (t+660.)
float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float nse(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y);}
float fbm(vec2 p){float a=.0,w=1.;for(int i=0;i<5;i++){a+=w*nse(p);p*=mat2(1,-1.2,.2,1.2)*2.;w*=.5;}return a;}
void main(){
  vec2 uv=(FC-.5*R)/R.y;uv.x+=.25;uv*=vec2(2,1);
  float n=fbm(uv*.28-vec2(T*.01,0));n=nse(uv*3.+n*2.);
  float r2=1.-fbm(uv+vec2(0,T*.015)+n);
  float g2=1.-fbm(uv*1.003+vec2(0,T*.015)+n+.003);
  float b2=1.-fbm(uv*1.006+vec2(0,T*.015)+n+.006);
  vec3 col=vec3(r2,g2,b2);
  const vec3 c=vec3(0.647,0.0,0.0);
  col=mix(col,c,dot(col,vec3(.21,.71,.07)));
  col=mix(vec3(.03),col,min(t*.1,1.));
  col=clamp(col,.03,.95);
  O=vec4(col,1);
}`;

export default function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    function resize() {
      const dpr = Math.min(devicePixelRatio, innerWidth < 768 ? 1 : 2);
      canvas!.width = innerWidth * dpr;
      canvas!.height = innerHeight * dpr;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    resize();
    window.addEventListener('resize', resize);

    const prog = gl.createProgram()!;
    const vs_ = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs_, vs);
    gl.compileShader(vs_);
    const fs_ = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs_, fs);
    gl.compileShader(fs_);
    if (!gl.getShaderParameter(fs_, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(fs_));
    gl.attachShader(prog, vs_);
    gl.attachShader(prog, fs_);
    gl.linkProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);

    const pl = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(pl);
    gl.vertexAttribPointer(pl, 2, gl.FLOAT, false, 0, 0);

    const rl = gl.getUniformLocation(prog, 'r');
    const tl = gl.getUniformLocation(prog, 't');

    let frameId: number;
    let paused = false;
    function frame(now: number) {
      if (document.hidden) { paused = true; return; }
      if (paused) { paused = false; frameId = requestAnimationFrame(frame); return; }
      gl!.clearColor(0, 0, 0, 1);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.useProgram(prog);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, buf);
      gl!.uniform2f(rl, canvas!.width, canvas!.height);
      gl!.uniform1f(tl, now * 0.001);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      frameId = requestAnimationFrame(frame);
    }
    frameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="bg-canvas" />;
}
