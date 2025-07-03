import { decode as decodeJpeg } from 'jpeg-js';
export const MEAN=[0.485,0.456,0.406];
export const STD =[0.229,0.224,0.225];
export const SIZE=224;

export async function looksLikeChart(buf){
  const {data,width,height}=decodeJpeg(buf,{maxWidth:64,maxHeight:64});
  let edge=0,total=0;
  for(let y=1;y<height;y++){
    for(let x=1;x<width;x++){
      const id=(y*width+x)*4;
      const idL=id-4,idT=id-width*4;
      const dl=Math.abs(data[id]-data[idL])+Math.abs(data[id+1]-data[idL+1])+Math.abs(data[id+2]-data[idL+2]);
      const dt=Math.abs(data[id]-data[idT])+Math.abs(data[id+1]-data[idT+1])+Math.abs(data[id+2]-data[idT+2]);
      if(dl+dt>100) edge++; total++;
    }
  }
  return edge/total>0.15;
}
