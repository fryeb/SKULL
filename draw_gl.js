let gl = null;
const MAX_SPRITES = 128;
const NUM_INDICIES = MAX_SPRITES * 6;
const VERTEX_SIZE = 4 * 4; // 4 * f32
const BUFFER_SIZE = MAX_SPRITES * 6 * VERTEX_SIZE; 
let vertex_buffer = undefined;
let index_buffer = undefined;
let texture = undefined;
let programInfo = undefined;

function initializeGL() {
	gl = WebGLDebugUtils.makeDebugContext(canvas.getContext('webgl'));

	// Generate VBO and VAO
//	vertex_array = gl.createVertexArray();
	vertex_buffer = gl.createBuffer();
//	gl.bindVertexArray(vertex_array);
//	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

	// Generate Index Buffer
	let indicies = [];
	let offset = 0;
	for (let i = 0; i < NUM_INDICIES; i++) {
		indicies.push(offset + 0);
		indicies.push(offset + 1);
		indicies.push(offset + 2);

		indicies.push(offset + 2);
		indicies.push(offset + 3);
		indicies.push(offset + 0);

		offset += 4;
	}
	console.log(indicies);
	index_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicies), gl.STATIC_DRAW);

	// Shader Program
  	const vsSource = `
    		attribute vec2 aVertexPosition;
    		attribute vec2 aTextureCoord;

    		uniform mat4 uModelViewMatrix;
    		uniform mat4 uProjectionMatrix;

    		varying highp vec2 vTextureCoord;

    		void main(void) {
			vec4 position = vec4(aVertexPosition.x, aVertexPosition.y, 0, 1);
      			gl_Position = uProjectionMatrix * uModelViewMatrix * position;
      			vTextureCoord = aTextureCoord;
    		}
  	`;

  	const fsSource = `
    		varying highp vec2 vTextureCoord;

    		uniform sampler2D uSampler;

    		void main(void) {
			gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    		}
  	`;

  	const shaderProgram = initShaderProgram(vsSource, fsSource);
  	programInfo = {
		program: shaderProgram,
    	 	 attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      			textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    	 	 },
		uniformLocations: {
		projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      		  	  modelViewMatrix:
				gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      		  	  uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
		},
  	};
}

function initShaderProgram(vsSource, fsSource) {
	function loadShader(type, source) {
  		const shader = gl.createShader(type);

  		gl.shaderSource(shader, source);
  		gl.compileShader(shader);

  		// Check for build errors
  		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    			console.log('Shader compilation error:' + gl.getShaderInfoLog(shader));
			console.log(source);
    			gl.deleteShader(shader);
    			return null;
  		}

  		return shader;
	}

	console.log('loading vertex shader');
  	const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
	console.log('loading fragment shader');
  	const fragmentShader = loadShader( gl.FRAGMENT_SHADER, fsSource);

  	// Create the shader program
  	const shaderProgram = gl.createProgram();
  	gl.attachShader(shaderProgram, vertexShader);
  	gl.attachShader(shaderProgram, fragmentShader);
  	gl.linkProgram(shaderProgram);

  	// Check for link errors
  	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    		alert('Shader program linking error:' + gl.getProgramInfoLog(shaderProgram));
    		return null;
  	}

  	return shaderProgram;
}

function drawGL() {
	// Clear screen
  	gl.clearColor(0.1, 0.1, 0.1, 1.0);
  	gl.clearDepth(1.0);
  	gl.enable(gl.DEPTH_TEST);
  	gl.depthFunc(gl.LEQUAL);
  	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Perspective projection
  	const fieldOfView = 45 * Math.PI / 180;   // in radians
  	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  	const zNear = 0.1;
  	const zFar = 100.0;
  	const projectionMatrix = mat4.create();
  	mat4.ortho(projectionMatrix,
		0, world_width, world_height, 0, 0.1, 100);

  	// Vertex attributes
  	{
    		const numComponents = 2;
    		const type = gl.FLOAT;
    		const normalize = false;
    		const stride = 0;
    		const offset = 0;
    		gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    		gl.vertexAttribPointer(
        			programInfo.attribLocations.vertexPosition,
        			numComponents,
        			type,
        			normalize,
        			stride,
        			offset);
    		gl.enableVertexAttribArray(
        			programInfo.attribLocations.vertexPosition);
  	}

   	const modelViewMatrix = mat4.create();
  	mat4.translate(modelViewMatrix,
                 	modelViewMatrix,
                 	[5.0, 5.0, -6.0]);
 	
	let data = new Float32Array([
    		// Front face
    		-1.0, -1.0,	-1.0,  1.0,
     		1.0,  1.0,  	 1.0,  -1.0,
	]);
	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);

	gl.useProgram(programInfo.program);
  	gl.uniformMatrix4fv(
      			programInfo.uniformLocations.projectionMatrix,
      			false,
      			projectionMatrix);
  	gl.uniformMatrix4fv(
      			programInfo.uniformLocations.modelViewMatrix,
      			false,
      			modelViewMatrix);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}
