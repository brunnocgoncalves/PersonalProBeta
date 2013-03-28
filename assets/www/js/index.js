	var idAluno;

	// Wait for Cordova to load
    //
	document.addEventListener("deviceready", onDeviceReady, false);

    // Cordova is ready
    //
    function onDeviceReady() {
        var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
        db.transaction(createDataBase, errorCD, successCD);
    }
	
	function listaAlunosAula(tx){
		tx.executeSql('SELECT * FROM S_ALUNO', [], successLAA, errorLAA);
	}
	
	function listaAlunosPagamento(tx){
		tx.executeSql('SELECT * FROM S_ALUNO', [], successLAP, errorLAP);
	}
	
	function createDataBase(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS S_ALUNO (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, valor TEXT, dataFicha DATETIME, datanascimento DATETIME, pagamento TEXT, tipo TEXT, aulaficha TEXT, created DATETIME, created_by TEXT, updated DATETIME, updated_by TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS S_AULA (id INTEGER PRIMARY KEY AUTOINCREMENT, idAluno INTEGER, data DATETIME, created DATETIME, created_by TEXT, updated DATETIME, updated_by TEXT)');
    }
	
	function zeraBaseDados(tx) {
        tx.executeSql('DROP TABLE S_ALUNO');
    }
	
	function carregaAluno(tx){
		tx.executeSql('SELECT S1.nome, S.data FROM S_AULA S INNER JOIN S_ALUNO S1 ON S1.id = S.idAluno Where S.idAluno = ' + idAluno, [], successLoadAluno, errorLoadAluno);
	}
	
	function successLoadAluno(tx, results) {
		console.log('Aulas');
		var len = results.rows.length;
		var parent = document.getElementById('listviewAulas');
		for (var i=0; i<len; i++){
			var listItem = document.createElement('li');
			listItem.setAttribute('id','listitem');
			
			listItem.innerHTML = 'Data: ' + results.rows.item(i).data;
	 
			parent.appendChild(listItem);
		}
		
		var list = document.getElementById('listviewAulas');
		$(list).listview("refresh");
		
    }
	
	function errorLoadAluno(err) {
        console.log("Error processing SQL: "+err.message);
    }
	
	function listaAlunos(tx){
		tx.executeSql('SELECT * FROM S_ALUNO', [], successLA, errorLA);
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
			
			listItem.innerHTML = '<a href="#" onclick="openAluno('+results.rows.item(i).id+');");">'
							+ '<h2>' + results.rows.item(i).nome + '</h2>'
							+ '<p><strong>Ficha iniciada em ' + results.rows.item(i).dataFicha + ' e irá vencer após ' + results.rows.item(i).aulaficha + ' aulas.</strong></p>'
							+ '<p>Pagamento a cada ' + results.rows.item(i).pagamento + ' ' + results.rows.item(i).tipo + '.</p>'
							+ '<p>Nasceu em ' + results.rows.item(i).datanascimento + '</p>'
							+ '<p>E-mail: ' + results.rows.item(i).email + '</p>'
							+ '<p class="ui-li-aside"><strong>R$' + results.rows.item(i).valor + '</strong></p>'
						+ '</a>';
	 
			parent.appendChild(listItem);
		}
		
		var list = document.getElementById('listview');
		$(list).listview("refresh");
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
		varpagamento = document.getElementById("pagamento").value;
		vartipo = $('#tipo').val();
        tx.executeSql('INSERT INTO S_ALUNO (nome, email, valor, dataficha, datanascimento, pagamento, tipo, aulaficha, created, created_by) VALUES ("' + varNome + '", "' + varEmail + '", "' + varValor + '", "' + varDataFicha + '", "' + vardatanascimento + '", "' + varpagamento + '", "' + vartipo + '", "' + varaulaficha + '", datetime("now"), "ADMIN")');
    }

	$( "#page" ).on( "pagecreate", function( event, ui ) {
		var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
        db.transaction(createDataBase, errorCD, successCD);
		db.transaction(listaAlunos, error);
	} );
	
	function openAluno(id){
		idAluno = id;
		$.mobile.changePage("#pagealuno");
	}
	
	function zeraBase(){
		var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
        db.transaction(zeraBaseDados, errorZB, successZB);
	}
	
	$( "#aula" ).on( "pagecreate", function( event, ui ) {
		var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
		db.transaction(listaAlunosAula, error);
	} );
	
	$( "#pagealuno" ).on( "pagecreate", function( event, ui ) {
		console.log('Aluno ' + idAluno);
		var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
		db.transaction(carregaAluno, error);
	} );
	
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
	
	function registraPagamento(){
		var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
		db.transaction(createPagamento, errorCP, successCP);
	}
	
	$( "#pagamento" ).on( "pagecreate", function( event, ui ) {
		console.log('Pagamento');
		var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
		db.transaction(listaAlunosPagamento, error);
	} );
	
	function pagamento(){
		$.mobile.changePage("#pagamento");
	}
	
	$( "#pagamento" ).on( "pagebeforecreate", function( event, ui ) {console.log('Before pagamento');} );