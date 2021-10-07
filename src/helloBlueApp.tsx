import React from "react";
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-dom";

const shaders = Shaders.create({
  helloBlue: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform float blue;
      void main() {
      gl_FragColor = vec4(uv.x, uv.y, blue, 1.0);
    }`,
  },
});

type Props = {
  blue: number
}

const HelloBlue: React.FC<Props> = (props) => {
  const { blue } = props;
  return (
     <Node shader={shaders.helloBlue} uniforms={{ blue }} />
  )
}

const HelloBlueApp = () => (
  <Surface width={300} height={300}>
    <HelloBlue blue={0.5} />
  </Surface>
);

export default HelloBlueApp;