var Main = {

	canvas : null,
	gl : null,
	vScript : null,
	fScript : null,
	vShader : null,
	fShader : null,
	vbo : null,
	ibo : null,

	shader : null,
	program : null,

	// models
	torusData : null,
	vPosition : null,
	vColor : null,
	vNormal : null,
	index : null,

	// matrix
	matrix : null,
	vMatrix : null,
	pMatrix : null,
	vpMatrix : null,
	mvpMatrix : null,
	invMatrix : null,

	lightDirection : null,
	count : null,
	run : null,

	attLocation : null,
	attStride : null,
	uniLocation : null,

	//-------------------------------------------
	// initialize
	//-------------------------------------------
	init : function() {

		window.addEventListener( "keydown", function( i_event ){ run = i_event.keyCode !== 27;}, true );

		// canvas の取得
		canvas = document.getElementById( "canvas" );
		// canvas のサイズを設定
		canvas.width;
		canvas.height;

		// webglコンテキストを取得
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

		// シェーダの初期化
		vScript = document.getElementById("vs").textContent;
		fScript = document.getElementById("fs").textContent;

		// 頂点シェーダとフラグメントシェーダの生成
		vShader = this._createShader(vScript, gl.VERTEX_SHADER);
		fShader = this._createShader(fScript, gl.FRAGMENT_SHADER);

		// プログラムオブジェクトの生成
		prg = this._createProgram(vShader, fShader);

		// attributeLocationの取得
		attLocation = [];
		attLocation[0] = gl.getAttribLocation(prg, "position");
		attLocation[1] = gl.getAttribLocation(prg, "normal");
		attLocation[2] = gl.getAttribLocation(prg, "color");

		// attributeの要素数
		attStride = [];
		attStride[0] = 3;
		attStride[1] = 3;
		attStride[2] = 4;

		// uniformLocationの取得
		uniLocation = [];
		uniLocation[0] = gl.getUniformLocation(prg, "mvpMatrix");
		uniLocation[1] = gl.getUniformLocation(prg, "invMatrix");
		uniLocation[2] = gl.getUniformLocation(prg, "lightDirection");


		// ユーティリティ関数からモデルを生成(トーラス)
		torusData = torus(64, 64, 0.25, 0.75);
		vPosition = torusData.p;
		vColor    = torusData.c;
		vNormal   = torusData.n;
		index     = torusData.i;

		// VBOの生成
		attVBO = [];
		attVBO[0] = this._createVbo(vPosition);
		attVBO[1] = this._createVbo(vNormal);
		attVBO[2] = this._createVbo(vColor);

		// VBOのバインドと登録
		this._setAttribute(attVBO, attLocation, attStride);

		// IBOの生成
		ibo = this._createIbo( index );

		// IBOをバインド
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);


		// matIVオブジェクトを生成
		matrix = new matIV();

		// 各種行列の生成と初期化
		mMatrix = matrix.identity( matrix.create() );
		vMatrix = matrix.identity( matrix.create() );
		pMatrix = matrix.identity( matrix.create() );
		vpMatrix = matrix.identity( matrix.create() );
		mvpMatrix = matrix.identity( matrix.create() );
		invMatrix = matrix.identity( matrix.create() );

		gl.viewport(0, 0, canvas.width, canvas.height);

		// ビュー座標変換行列
		matrix.lookAt([0.0, 0.0, 5.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0], vMatrix);

		// プロジェクション座標変換行列
		matrix.perspective(45, canvas.width / canvas.height, 0.1, 10.0, pMatrix);

		// 各行列を掛け合わせ座標変換行列
		matrix.multiply(pMatrix, vMatrix, vpMatrix);

		// canvas 初期化の設定
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);

		// いくつかの設定を有効化する
		gl.enable( gl.DEPTH_TEST );
		gl.depthFunc( gl.LEQUAL );
		gl.enable( gl.CULL_FACE );

		// 法線の設定
		lightDirection = [0.577, 0.577, 0.577];

		count = 0;
		run = true;

		// 描画
		this._render( run );

	},

	//-------------------------------------------
	// create shader
	//-------------------------------------------
	_createShader : function(i_src, i_type){

		// シェーダの生成
		shader = gl.createShader( i_type );

		// 生成されたシェーダにソースを割り当てる
		gl.shaderSource( shader, i_src );

		// シェーダをコンパイルする
		gl.compileShader( shader );

		// シェーダが正しくコンパイルされたかチェック
		if( gl.getShaderParameter( shader, gl.COMPILE_STATUS )) {

			return shader;

		} else {

			// 失敗していたらエラーログをアラートする
			console.log(gl.getShaderInfoLog( shader ));

			// null を返して終了
			return null;
		}


	},

	//-------------------------------------------
	// create program
	//-------------------------------------------
	_createProgram : function( i_vs, i_fs ){

		program = gl.createProgram();

		// プログラムオブジェクトにシェーダを割り当てる
		gl.attachShader( program, i_vs );
		gl.attachShader( program, i_fs );

		// シェーダをリンク
		gl.linkProgram( program );

		// シェーダのリンクが正しく行なわれたかチェック
		if( gl.getProgramParameter( program, gl.LINK_STATUS )){

			// 成功していたらプログラムオブジェクトを有効にする
			gl.useProgram( program );

			// プログラムオブジェクトを返して終了
			return program;

		} else {

			// 失敗していたらエラーログをアラートする
			console.log(gl.getProgramInfoLog( program ));

			// null を返して終了
			return null;
		}
	},

	//-------------------------------------------
	// create vbo
	//-------------------------------------------
	_createVbo : function( i_data ) {

		// バッファオブジェクトの生成
		vbo = gl.createBuffer();

		// バッファをバインドする
		gl.bindBuffer( gl.ARRAY_BUFFER, vbo );

		// バッファにデータをセット
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( i_data ), gl.STATIC_DRAW );

		// バッファのバインドを無効化
		gl.bindBuffer( gl.ARRAY_BUFFER, null );

		// 生成した VBO を返して終了
		return vbo;

	},

	//-------------------------------------------
	// create ibo
	//-------------------------------------------
	_createIbo : function( i_data ){

		// バッファオブジェクトの生成
		ibo = gl.createBuffer();

		// バッファをバインドする
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

		// バッファにデータをセット
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array( i_data ), gl.STATIC_DRAW);

		// バッファのバインドを無効化
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		// 生成したIBOを返して終了
		return ibo;

	},

	//-------------------------------------------
	// set attribute
	//-------------------------------------------
	_setAttribute : function( i_vbo, i_attL, i_attS ) {
		// 引数として受け取った配列を処理する
		for( var i in i_vbo ){
			// バッファをバインドする
			gl.bindBuffer( gl.ARRAY_BUFFER, i_vbo[i] );

			// attributeLocationを有効にする
			gl.enableVertexAttribArray( i_attL[i] );

			// attributeLocationを通知し登録する
			gl.vertexAttribPointer( i_attL[i], i_attS[i], gl.FLOAT, false, 0, 0 );
		}
	},

	//-------------------------------------------
	// render
	//-------------------------------------------
	_render : function( i_data ) {

		// カウンタのインクリメント
		count++;

		// アニメーション用にカウンタからラジアンを計算
		var rad = (count % 360) * Math.PI / 180;

		// canvas の色と深度値を初期化
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

		// モデル座標変換行列
		matrix.identity( mMatrix );
		matrix.rotate( mMatrix, rad, [0.0, 1.0, 1.0], mMatrix );
		matrix.multiply( vpMatrix, mMatrix, mvpMatrix );
		matrix.inverse( mMatrix, invMatrix );

		// uniformLocationへ座標変換行列を登録
		gl.uniformMatrix4fv( uniLocation[0], false, mvpMatrix);
		gl.uniformMatrix4fv( uniLocation[1], false, invMatrix);
		gl.uniform3fv( uniLocation[2], lightDirection);

		// モデルの描画
		gl.drawElements( gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0 );

		// コンテキストの再描画
		gl.flush();

		// フラグをチェックしてアニメーション
		if( run ){ requestAnimationFrame( this._render.bind(this) ); }

	}

}

window.onload = function() { Main.init() };
