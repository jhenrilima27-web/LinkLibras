<?php

// Avisa que vai ser em json as informações
header("Content-Type: application/json");

// Recebe os dados enviados pelo JavaScript
$dados = json_decode(
    file_get_contents("php://input"),
    true
);

try {

    // Dados de conexão com o banco
    $host    = "sql302.infinityfree.com";
    $banco   = "if0_41679144_linklibras_db";
    $usuario = "if0_41679144";
    $senha   = "XSjVvTFvxk5m";

    // Conexão com o MySQL
    $pdo = new PDO(
        "mysql:host=$host;dbname=$banco;charset=utf8",
        $usuario,
        $senha
    );

    // Ativa mensagens de erro do PDO
    $pdo->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

    // Comando SQL
    $sql = "INSERT INTO interpretes (nomeCompleto, estado, cidade, descricao, foto, precoHora)
            VALUES (:nomeCompleto, :estado, :cidade, :descricao, :foto, :precoHora)";

    // Prepara o SQL
    $stmt = $pdo->prepare($sql);

    // Liga os dados recebidos aos parâmetros do SQL
    $stmt->bindValue(":nomeCompleto", $dados["nome"]);
    $stmt->bindValue(":estado", $dados["estado"]);
    $stmt->bindValue(":cidade", $dados["cidade"]);
    $stmt->bindValue(":descricao", $dados["descricao"]);
    $stmt->bindValue(":foto", $dados["imagem"]);
    $stmt->bindValue(":precoHora", $dados["preco"]);

    // Executa o INSERT
    $stmt->execute();

    // Retorna sucesso
    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Intérprete cadastrado com sucesso"
    ]);

} catch(PDOException $erro) {

    // Retorna erro
    echo json_encode([
        "sucesso" => false,
        "mensagem" => $erro->getMessage()
    ]);
}
?>