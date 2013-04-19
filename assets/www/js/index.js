	var idAluno;
	var novoId;

	// Wait for Cordova to load
    //
	document.addEventListener("deviceready", onDeviceReady, false);

    // Cordova is ready
    //
    function onDeviceReady() {
		var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
        db.transaction(createDataBase, errorCD, successCD);
		db.transaction(listaAlunos, error);
    }
	
	function listaAlunosAula(tx){
		tx.executeSql('SELECT * FROM S_ALUNO', [], successLAA, errorLAA);
	}
	
	function listaAlunosPagamento(tx){
		tx.executeSql('SELECT * FROM S_ALUNO', [], successLAP, errorLAP);
	}
	
	function deleteAluno(tx){
		tx.executeSql('DELETE FROM S_ALUNO WHERE id = ' + idAluno);
	}
	
	function deleteSucess(){
		$.mobile.loadPage("#page");
		$.mobile.changePage("#page");
	}
	
	function createDataBase(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS S_ALUNO (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, valor TEXT, dataFicha DATETIME, datanascimento DATETIME, pagamento TEXT, tipo TEXT, aulaficha TEXT, created DATETIME, created_by TEXT, updated DATETIME, updated_by TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS S_AULA (id INTEGER PRIMARY KEY AUTOINCREMENT, idAluno INTEGER, data DATETIME, created DATETIME, created_by TEXT, updated DATETIME, updated_by TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS S_PAGAMENTO (id INTEGER PRIMARY KEY AUTOINCREMENT, idAluno INTEGER, data DATETIME, valor TEXT, created DATETIME, created_by TEXT, updated DATETIME, updated_by TEXT)');
    }
	
	function zeraBaseDados(tx) {
        tx.executeSql('DROP TABLE S_ALUNO');
    }
	
	function carregaAluno(tx){
		tx.executeSql('SELECT * FROM S_ALUNO Where id = ' + idAluno, [], successLoadAluno, errorLoadAluno);
	}
	
	function carregaAula(tx){
		tx.executeSql('SELECT data FROM S_AULA Where idAluno = ' + idAluno, [], successLoadAula, errorLoadAluno);
	}
	
	function carregaPagamentoAluno(tx){
		tx.executeSql('SELECT * FROM S_PAGAMENTO S Where S.idAluno = ' + idAluno, [], successLoadPagamento, errorLoadPagamento);
	}
	
	function successLoadAluno(tx, results) {
		console.log("Load Aluno");
		var len = results.rows.length;
		for (var i=0; i<len; i++){
			document.getElementById('dadosAluno').innerHTML = '<p><strong>Ficha iniciada em ' + results.rows.item(i).dataFicha + ' e ira vencer apos ' + results.rows.item(i).aulaficha + ' aulas.</strong></p>'
							+ '<p>Pagamento a cada ' + results.rows.item(i).pagamento + ' ' + results.rows.item(i).tipo + '.</p>'
							+ '<p>Nasceu em ' + results.rows.item(i).datanascimento + '</p>'
							+ '<p>E-mail: ' + results.rows.item(i).email + '</p>'
							+ '<p><strong>Valor aula: R$' + results.rows.item(i).valor + '</strong></p>';
		}
				
    }
	
	function successLoadPagamento(tx, results) {
		console.log('Pagamentos: ' + results.rows.length);
		var len = results.rows.length;
		var parent = document.getElementById('listviewPagamentos');
		parent.innerHTML = "";
		for (var i=0; i<len; i++){
			parent.innerHTML = parent.innerHTML + '<li><p>Data: ' + results.rows.item(i).data + '</p>'
							+ '<p class="ui-li-aside"><strong>R$' + results.rows.item(i).valor + '</strong></p></li>';
		}
		
		var list = document.getElementById('listviewPagamentos');
		$(list).listview("refresh");
			
    }
	
	function successLoadAula(tx, results) {
		console.log('Aulas');
		var len = results.rows.length;
		var parent = document.getElementById('listviewAulas');
		parent.innerHTML = "";
		for (var i=0; i<len; i++){
			parent.innerHTML = parent.innerHTML + '<li><p>Data: ' + results.rows.item(i).data + '</p></li>';
		}
		
		var list = document.getElementById('listviewAulas');
		$(list).listview("refresh");
				
    }
	
	function errorLoadAluno(err) {
        console.log("Error processing SQL: "+err.message);
    }
	
	function errorLoadPagamento(err) {
        console.log("Error processing SQL: "+err.message);
    }
	
	function listaAlunos(tx){
		tx.executeSql('SELECT * FROM S_ALUNO', [], successLA, errorLA);
	}
	
	function listaAlunos2(tx){
		tx.executeSql('SELECT * FROM S_ALUNO', [], successLAAlunos, errorLA);
	}
	
	function successLAA(tx, results) {
		console.log(results.rows.length);
		var len = results.rows.length;
		var list = document.getElementById('aluno');
		for (var i=0; i<len; i++){
					
			$('#aluno').append('<option value='+results.rows.item(i).id+'>'+results.rows.item(i).nome+'</option>');

		}
		
		$(list).listview("refresh");
		
    }
	
	function errorLAA(err) {
        console.log("Error processing SQL: "+err.message);
    }
	
	function successLAP(tx, results) {
		console.log('Lista P');
		var len = results.rows.length;
		var list = document.getElementById('alunoPagamento');
		for (var i=0; i<len; i++){
					
			$('#alunoPagamento').append('<option value='+results.rows.item(i).id+'>'+results.rows.item(i).nome+'</option>');

		}
		
		$(list).listview("refresh");
		
    }
	
	function errorLAP(err) {
        console.log("Error processing SQL: "+err.message);
    }
	
	function successLA(tx, results) {
		console.log(results.rows.length);
		var len = results.rows.length;
		var parent = document.getElementById('listview');
		for (var i=0; i<len; i++){
			var listItem = document.createElement('li');
			listItem.setAttribute('id','listitem');
			
			listItem.innerHTML = '<a href="#" onclick="openAluno(' +results.rows.item(i).id+ ', \''+ results.rows.item(i).nome +'\');">'
							+ '<h2>' + results.rows.item(i).nome + '</h2>'
							//+ '<p><strong>Ficha iniciada em ' + results.rows.item(i).dataFicha + ' e irá vencer após ' + results.rows.item(i).aulaficha + ' aulas.</strong></p>'
							//+ '<p>Pagamento a cada ' + results.rows.item(i).pagamento + ' ' + results.rows.item(i).tipo + '.</p>'
							//+ '<p>Nasceu em ' + results.rows.item(i).datanascimento + '</p>'
							//+ '<p>E-mail: ' + results.rows.item(i).email + '</p>'
							//+ '<p class="ui-li-aside"><strong>R$' + results.rows.item(i).valor + '</strong></p>'
						+ '</a>';
	 
			parent.appendChild(listItem);
			novoId = results.rows.item(i).id;
		}
		
		var list = document.getElementById('listview');
		$(list).listview("refresh");
		
		novoId = novoId + 1;
    }
	
	function successLAAlunos(tx, results) {
		console.log(results.rows.length);
		var len = results.rows.length;
		var parent = document.getElementById('listviewAlunos');
		parent.innerHTML = "";
		for (var i=0; i<len; i++){
			//var listItem = document.createElement('li');
			//listItem.setAttribute('id','listitem');
			
			parent.innerHTML = parent.innerHTML + '<li><a href="#" onclick="openAluno(' +results.rows.item(i).id+ ', \''+ results.rows.item(i).nome +'\');">'
							+ '<h2>' + results.rows.item(i).nome + '</h2>'
							//+ '<p><strong>Ficha iniciada em ' + results.rows.item(i).dataFicha + ' e irá vencer após ' + results.rows.item(i).aulaficha + ' aulas.</strong></p>'
							//+ '<p>Pagamento a cada ' + results.rows.item(i).pagamento + ' ' + results.rows.item(i).tipo + '.</p>'
							//+ '<p>Nasceu em ' + results.rows.item(i).datanascimento + '</p>'
							//+ '<p>E-mail: ' + results.rows.item(i).email + '</p>'
							//+ '<p class="ui-li-aside"><strong>R$' + results.rows.item(i).valor + '</strong></p>'
						+ '</a></li>';
	 
			//parent.appendChild(listItem);
			novoId = results.rows.item(i).id;
			
		}
		
		var list = document.getElementById('listviewAlunos');
		$(list).listview("refresh");
		
		novoId = novoId + 1;
    }
	
	function errorLA(err) {
        console.log("Error processing SQL: "+err.message);
    }
	
	function successZB() {
        alert('Base zerada.');
    }
	
	function errorZB() {
        console.log("Error processing SQL: "+err.message);
    }
	
	function error(err) {
        console.log("Error processing SQL: "+err.message);
    }
	
	function errorCD(err) {
        console.log("Error processing SQL: "+err.message);
    }

    // Transaction success callback
    //
    function successCD() {
        console.log('Base de dados criada com sucesso!');
    }
	
	function errorCA(err) {
        console.log("Error processing SQL: "+err.message);
    }

    // Transaction success callback
    //
    function successCA() {
        alert('Aluno criado com sucesso!');
		var parent = document.getElementById('listview');
		//var listItem = document.createElement('li');
		//listItem.setAttribute('id','listitem');
		
		parent.innerHTML = parent.innerHTML + '<li><a href="#" onclick="openAluno('+novoId+', \'' + document.getElementById("name").value + '\');">'
						+ '<h2>' + document.getElementById("name").value + '</h2>'
						+ '<p><strong>Ficha iniciada em ' + document.getElementById("dataficha").value + ' e irá vencer após ' + document.getElementById("aulaficha").value + ' aulas.</strong></p>'
						+ '<p>Pagamento a cada ' + document.getElementById("pagamento").value + ' ' + $('#tipo').val() + '.</p>'
						+ '<p>Nasceu em ' + document.getElementById("datanascimento").value + '</p>'
						+ '<p>E-mail: ' + document.getElementById("email").value + '</p>'
						+ '<p class="ui-li-aside"><strong>R$' + document.getElementById("valor").value + '</strong></p>'
					+ '</a></li>';
 
		//parent.appendChild(listItem);
		
		var list = document.getElementById('listview');
		$(list).listview("refresh");
    }
	
	function save(){
		var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
		db.transaction(createAluno, errorCA, successCA);
	}
	
	function createAluno(tx) {
		varNome = document.getElementById("name").value;
		varEmail = document.getElementById("email").value;
		varValor = document.getElementById("valor").value;
		varDataFicha = document.getElementById("dataficha").value;
		varaulaficha = document.getElementById("aulaficha").value;
		vardatanascimento = document.getElementById("datanascimento").value;
		varpagamento = document.getElementById("formaPagamento").value;
		vartipo = $('#tipo').val();
        tx.executeSql('INSERT INTO S_ALUNO (nome, email, valor, dataficha, datanascimento, pagamento, tipo, aulaficha, created, created_by) VALUES ("' + varNome + '", "' + varEmail + '", "' + varValor + '", "' + varDataFicha + '", "' + vardatanascimento + '", "' + varpagamento + '", "' + vartipo + '", "' + varaulaficha + '", datetime("now"), "ADMIN")');
    }

	$( "#page" ).on( "pagecreate", function( event, ui ) {
		//var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
        //db.transaction(createDataBase, errorCD, successCD);
		onDeviceReady();
		//db.transaction(listaAlunos, error);
	} );
	
	function openAluno(id, nome){
		idAluno = id;
		$('#nomeAluno').text(nome);
		$.mobile.loadPage("#pagealuno");
		console.log('Aluno ' + idAluno);
		var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
		db.transaction(carregaAluno, error);
		db.transaction(carregaAula, error);
		db.transaction(carregaPagamentoAluno, error);
		db.transaction(listaAlunos2, error);
		$.mobile.changePage("#pagealuno");
	}
	
	function zeraBase(){
		var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
        db.transaction(zeraBaseDados, errorZB, successZB);
	}
	
	/*$( "#aula" ).on( "pagecreate", function( event, ui ) {
		var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
		db.transaction(listaAlunosAula, error);
	} );*/
	
	/*$( "#pagealuno" ).on( "pagecreate", function( event, ui ) {
		console.log('Aluno ' + idAluno);
		var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
		db.transaction(carregaAluno, error);
	} );*/
	
	function createAula(tx) {
		varAluno = $('#aluno').val();
		varData = document.getElementById("data").value;
        tx.executeSql('INSERT INTO S_AULA (idAluno, data, created, created_by) VALUES ("' + varAluno + '", "' + varData + '", datetime("now"), "ADMIN")');
    }
	
	function errorCAA(err) {
        console.log("Error processing SQL: "+err.message);
    }

    // Transaction success callback
    //
    function successCAA() {
        alert('Aula registrada com sucesso!');
    }
	
	function registraAula(){
		var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
		db.transaction(createAula, errorCAA, successCAA);
	}
	
	function createPagamento(tx) {
		varAluno = idAluno;
		varData = document.getElementById("dataPagamento").value;
		varPagamento = document.getElementById("valorPagamento").value;
        tx.executeSql('INSERT INTO S_PAGAMENTO (idAluno, data, valor, created, created_by) VALUES ("' + varAluno + '", "' + varData + '", "' + varPagamento + '", datetime("now"), "ADMIN")');
    }
	
	function errorCP(err) {
        console.log("Error processing SQL: "+err.message);
    }

    // Transaction success callback
    //
    function successCP() {
        alert('Pagamento registrado com sucesso!');
    }
	
	function registraPagamento(){
		var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
		db.transaction(createPagamento, errorCP, successCP);
	}
	
	function excluir(){
			$('#deleteAluno').popup("open");
	}
	
	function removeAluno(){
		var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
		db.transaction(deleteAluno, errorCP, deleteSucess);
	}