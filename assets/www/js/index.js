var idAluno;
var idAula;
var novoId;
var aulas;
var pagamentos;
var credito;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
	db.transaction(createDataBase, errorSQL, successCD);
	db.transaction(listaAlunos, errorSQL);
}

function listaAlunosAula(tx){
	tx.executeSql('SELECT * FROM S_ALUNO', [], successLAA, errorSQL);
}

function listaAlunosPagamento(tx){
	tx.executeSql('SELECT * FROM S_ALUNO', [], successLAP, errorSQL);
}

function deleteAluno(tx){
	tx.executeSql('DELETE FROM S_ALUNO WHERE id = ' + idAluno);
}

function deleteSucess(){
	$.mobile.loadPage("#page");
	var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
	db.transaction(listaAlunos, errorSQL);
	$.mobile.changePage("#page");
}

function createDataBase(tx) {
	tx.executeSql('CREATE TABLE IF NOT EXISTS S_ALUNO (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, valor TEXT, dataFicha DATETIME, datanascimento DATETIME, pagamento TEXT, tipo TEXT, aulaficha TEXT, created DATETIME, created_by TEXT, updated DATETIME, updated_by TEXT)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS S_AULA (id INTEGER PRIMARY KEY AUTOINCREMENT, idAluno INTEGER, data DATETIME, created DATETIME, created_by TEXT, updated DATETIME, updated_by TEXT)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS S_PAGAMENTO (id INTEGER PRIMARY KEY AUTOINCREMENT, idAluno INTEGER, data DATETIME, valor TEXT, created DATETIME, created_by TEXT, updated DATETIME, updated_by TEXT)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS S_FICHA (id INTEGER PRIMARY KEY AUTOINCREMENT, idAluno INTEGER, data DATETIME, desc TEXT, created DATETIME, created_by TEXT, updated DATETIME, updated_by TEXT)');
}

function zeraBaseDados(tx) {
	tx.executeSql('DROP TABLE S_ALUNO');
	tx.executeSql('DROP TABLE S_AULA');
	tx.executeSql('DROP TABLE S_PAGAMENTO');
}

function carregaAluno(tx){
	tx.executeSql('SELECT '
		+ 'strftime("%d/%m/%Y",S.dataFicha) dataFicha '
		+ ',S.aulaficha '
		+ ',S.pagamento '
		+ ',S.tipo '
		+ ',strftime("%d/%m/%Y",S.datanascimento) datanascimento '
		+ ',S.nome '
		+ ',S.email '
		+ ',S.valor '
		+ ',Count(S1.id) aulas '
		+ 'FROM S_ALUNO S '
		+ 'Left Join S_AULA S1 On( '
		+ '	S1.idAluno = S.id '
		+ ') '
		+ 'Where '
		+ 'S.id = ' + idAluno
		+ ' Group By '
		+ 'S.dataFicha '
		+ ',S.aulaficha '
		+ ',S.pagamento '
		+ ',S.tipo '
		+ ',S.datanascimento '
		+ ',S.email '
		+ ',S.valor '
		, [], successLoadAluno, errorSQL);
}

function successLoadAluno(tx, results) {
	console.log("Load Aluno");
	var len = results.rows.length;
	for (var i=0; i<len; i++){
		document.getElementById('nomeAluno').innerHTML = results.rows.item(i).nome;
		document.getElementById('dadosAluno').innerHTML = '<p>Ficha iniciada em ' + results.rows.item(i).dataFicha + ' e ira vencer apos ' + results.rows.item(i).aulaficha + ' aulas.</p>'
						+ '<p>Pagamento a cada ' + results.rows.item(i).pagamento + ' ' + results.rows.item(i).tipo + '.</p>'
						+ '<p>Nasceu em ' + results.rows.item(i).datanascimento + '</p>'
						+ '<p>E-mail: ' + results.rows.item(i).email + '</p>'
						+ '<p>Valor aula: <strong>R$' + results.rows.item(i).valor + '</strong></p>';
		aulas = results.rows.item(i).aulas;
		valorAula = results.rows.item(i).valor;
	}
	var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
	db.transaction(loadCredito, errorSQL);	
			
}

function loadCredito(tx){
	tx.executeSql('SELECT SUM(valor) pagamentos FROM S_PAGAMENTO Where idAluno = ' + idAluno, [], successLoadCredito, errorSQL);
}

function successLoadCredito(tx, results) {
	console.log("Load crédito");
	var len = results.rows.length;
	for (var i=0; i<len; i++){
		pagamentos = results.rows.item(i).pagamentos;
	}
	credito = pagamentos - aulas * valorAula;
	document.getElementById('nomeAluno').innerHTML = document.getElementById('nomeAluno').innerHTML + ' / Saldo: R$' + credito;
	document.getElementById('dadosAluno').innerHTML = document.getElementById('dadosAluno').innerHTML + ' <b>Saldo: R$' + credito + '</b>';
}

function carregaAula(tx){
	tx.executeSql('SELECT strftime("%d/%m/%Y",data) data, id FROM S_AULA Where idAluno = ' + idAluno, [], successLoadAula, errorSQL);
}

function carregaAulaPagamento(tx){
	tx.executeSql('SELECT strftime("%d/%m/%Y",data) data FROM S_AULA Where paga = "N" And idAluno = ' + idAluno, [], successLoadAulaPagamento, errorSQL);
}

function carregaPagamentoAluno(tx){
	tx.executeSql('SELECT strftime("%d/%m/%Y",data) data,* FROM S_PAGAMENTO S Where S.idAluno = ' + idAluno, [], successLoadPagamento, errorSQL);
}

function carregaFichaAluno(tx){
	tx.executeSql('SELECT * FROM S_FICHA S Where S.idAluno = ' + idAluno, [], successLoadFicha, errorSQL);
}

function successLoadFicha(tx, results) {
	console.log('Ficha: ' + results.rows.length);
	var len = results.rows.length;
	var parent = document.getElementById('listviewFichas');
	parent.innerHTML = '<li id="listdiv" data-role="list-divider">Fichas registradas</li>';
	for (var i=0; i<len; i++){
		parent.innerHTML = parent.innerHTML + '<li><p>Data início: ' + results.rows.item(i).data + '</p>'
						+ '<p>' + results.rows.item(i).desc + '</p></li>';
	}
	
	$(parent).listview("refresh");
		
}

function successLoadPagamento(tx, results) {
	console.log('Pagamentos: ' + results.rows.length);
	var len = results.rows.length;
	var parent = document.getElementById('listviewPagamentos');
	parent.innerHTML = '<li id="listdiv" data-role="list-divider">Pagamentos registrados</li>';
	for (var i=0; i<len; i++){
		parent.innerHTML = parent.innerHTML + '<li><p>Data: ' + results.rows.item(i).data + '</p>'
						+ '<p class="ui-li-aside"><strong>R$' + results.rows.item(i).valor + '</strong></p></li>';
	}
	
	var list = document.getElementById('listviewPagamentos');
	$(list).listview("refresh");
		
}

function successLoadAulaPagamento(tx, results) {
	var len = results.rows.length;
	var parent = document.getElementById('listviewAulas2');
	parent.innerHTML = "";
	for (var i=0; i<len; i++){
		parent.innerHTML = parent.innerHTML + '<li><p>Data: ' + results.rows.item(i).data + '</p></li>';
	}
	
	$(parent).listview("refresh");
			
}

function successLoadAula(tx, results) {
	console.log('Aulas');
	var len = results.rows.length;
	var parent = document.getElementById('listviewAulas');
	parent.innerHTML = '<li id="listdiv" data-role="list-divider">Aulas registradas</li>';
	for (var i=0; i<len; i++){
		parent.innerHTML = parent.innerHTML + '<li><a href="#" onClick="excluirAula('+ results.rows.item(i).id +');"><p>Data: ' + results.rows.item(i).data + '</p></a></li>';
	}
	
	var list = document.getElementById('listviewAulas');
	$(list).listview("refresh");
			
}

function errorSQL(err) {
	console.log("Error processing SQL: "+err.message);
}

function listaAlunos(tx){
	tx.executeSql('SELECT * FROM S_ALUNO', [], successLA, errorSQL);
}

function listaAlunos2(tx){
	tx.executeSql('SELECT * FROM S_ALUNO', [], successLAAlunos, errorSQL);
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

function successLAP(tx, results) {
	console.log('Lista P');
	var len = results.rows.length;
	var list = document.getElementById('alunoPagamento');
	for (var i=0; i<len; i++){
				
		$('#alunoPagamento').append('<option value='+results.rows.item(i).id+'>'+results.rows.item(i).nome+'</option>');

	}
	
	$(list).listview("refresh");
	
}

function successLA(tx, results) {
	console.log(results.rows.length);
	var len = results.rows.length;
	var parent = document.getElementById('listview');
	parent.innerHTML = "";
	for (var i=0; i<len; i++){
		
		parent.innerHTML = parent.innerHTML + '<li><a href="#" onclick="openAluno(' +results.rows.item(i).id+ ', \''+ results.rows.item(i).nome +'\');">'
						+ '<h2>' + results.rows.item(i).nome + '</h2>'
						+ '</a></li>';
 
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
	parent.innerHTML = '<li><a href="#page">Novo aluno</a></li>';
	parent.innerHTML = parent.innerHTML + '<li><a href="#" onClick="zeraBase();">Zerar base</a></li>';
	for (var i=0; i<len; i++){
		
		parent.innerHTML = parent.innerHTML + '<li><a href="#" onclick="openAluno(' +results.rows.item(i).id+ ', \''+ results.rows.item(i).nome +'\');">'
						+ '<h2>' + results.rows.item(i).nome + '</h2>'
						+ '</a></li>';
 
		novoId = results.rows.item(i).id;
		
	}
	
	var list = document.getElementById('listviewAlunos');
	$(list).listview("refresh");
	
	novoId = novoId + 1;
}

function successZB() {
	alert('Base zerada.');
}

function successCD() {
	console.log('Base de dados criada com sucesso!');
}

function successCA() {
	alert('Aluno criado com sucesso!');
	
	var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
	db.transaction(listaAlunos, errorSQL);
}

function save(){
	var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
	db.transaction(createAluno, errorSQL, successCA);
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
	onDeviceReady();
} );

function openAluno(id, nome){
	idAluno = id;
	$('#nomeAluno').text(nome);
	$.mobile.loadPage("#pagealuno");
	console.log('Aluno ' + idAluno);
	var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
	db.transaction(carregaAluno, errorSQL);
	db.transaction(carregaAula, errorSQL);
	db.transaction(carregaPagamentoAluno, errorSQL);
	db.transaction(listaAlunos2, errorSQL);
	db.transaction(carregaFichaAluno, errorSQL);
	$.mobile.changePage("#pagealuno");
}

function zeraBase(){
	alert('Inativado');
	return;
	var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
	db.transaction(zeraBaseDados, errorSQL, successZB);
}

function createAula(tx) {
	varData = document.getElementById("data").value;
	tx.executeSql('INSERT INTO S_AULA (idAluno, data, created, created_by) VALUES ("' + idAluno + '", "' + varData + '", datetime("now"), "ADMIN")');
}

function successCAA() {
	alert('Aula registrada com sucesso!');
	varData = document.getElementById("data").value = '';
	var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
	db.transaction(carregaAula, errorSQL);
	db.transaction(carregaAluno, errorSQL);
}

function registraAula(){
	var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
	db.transaction(createAula, errorSQL, successCAA);
}

function createPagamento(tx) {
	varAluno = idAluno;
	varData = document.getElementById("dataPagamento").value;
	varPagamento = document.getElementById("valorPagamento").value;
	tx.executeSql('INSERT INTO S_PAGAMENTO (idAluno, data, valor, created, created_by) VALUES ("' + varAluno + '", "' + varData + '", "' + varPagamento + '", datetime("now"), "ADMIN")');
}

function createFicha(tx){
	varAluno = idAluno;
	varData = document.getElementById("dataInicio").value;
	varDesc = document.getElementById("textFicha").value;
	tx.executeSql('INSERT INTO S_FICHA (idAluno, data, desc, created, created_by) VALUES ("' + varAluno + '", "' + varData + '", "' + varDesc + '", datetime("now"), "ADMIN")');
}

function successCP() {
	alert('Pagamento registrado com sucesso!');
	var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
	db.transaction(carregaPagamentoAluno, errorSQL);
	db.transaction(carregaAluno, errorSQL);
}

function successCF() {
	alert('Ficha registrada com sucesso!');
	document.getElementById("dataInicio").value = '';
	document.getElementById("textFicha").value = '';
	var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
	db.transaction(carregaFichaAluno, errorSQL);
}

function registraPagamento(){
	var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
	db.transaction(createPagamento, errorSQL, successCP);
}

function excluir(){
		$('#deleteAluno').popup("open");
}

function removeAluno(){
	var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
	db.transaction(deleteAluno, errorSQL, deleteSucess);
}

function registraFicha(){
	var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
	db.transaction(createFicha, errorSQL, successCF);
}

function deleteAula(tx){
	tx.executeSql('DELETE FROM S_AULA WHERE id = ' + idAula);	
}

function excluirAula(id){
	var r=confirm("A aula sera excluida!");
	if (r==true)
	  {
	  idAula = id;
	var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
	db.transaction(deleteAula, errorSQL, sucessEA);
	  }
	else
	  {
	  return;
	  }
}

function sucessEA () {
	alert('Excluido com sucesso!!!');
	var db = window.openDatabase("PersonalProBeta", "1.0", "Personal Pro", 200000);
	db.transaction(carregaAluno, errorSQL);
	db.transaction(carregaAula, errorSQL);
	db.transaction(carregaPagamentoAluno, errorSQL);
	db.transaction(listaAlunos2, errorSQL);
	db.transaction(carregaFichaAluno, errorSQL);
}