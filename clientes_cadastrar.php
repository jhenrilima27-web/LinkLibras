<?php

header("Content-Type: application/json");

$dados = json_decode(
    file_get_contents("php://input"),
    true
);

try {

    // Configuração do banco
    $host = "sql302.infinityfree.com";
    $banco = "if0_41679144_linklibras_db";
    $usuario = "if0_41679144";
    $senhaBanco = "XSjVvTFvxk5m";

    // Conexão com o banco
    $pdo = new PDO(
        "mysql:host=$host;dbname=$banco;charset=utf8",
        $usuario,
        $senhaBanco
    );

    // Configurar PDO para mostrar erros
    $pdo->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

    // Criptografar senha
    $senhaHash = password_hash(
        $dados["senha"],
        PASSWORD_DEFAULT
    );

    // SQL
    $sql = "
    INSERT INTO Clientes
    (
        nome,
        cpf,
        email,
        telefone,
        deficiencia,
        cep,
        estado,
        cidade,
        bairro,
        complemento,
        senha
    )
    VALUES
    (
        :nome,
        :cpf,
        :email,
        :telefone,
        :deficiencia,
        :cep,
        :estado,
        :cidade,
        :bairro,
        :complemento,
        :senha
    )";

    // Preparar SQL
    $stmt = $pdo->prepare($sql);

    // Associar valores
    $stmt->bindValue(":nome", $dados["nome"]);
    $stmt->bindValue(":cpf", $dados["cpf"]);
    $stmt->bindValue(":email", $dados["email"]);
    $stmt->bindValue(":telefone", $dados["telefone"]);
    $stmt->bindValue(":deficiencia", $dados["deficiencia"]);
    $stmt->bindValue(":cep", $dados["cep"]);
    $stmt->bindValue(":estado", $dados["estado"]);
    $stmt->bindValue(":cidade", $dados["cidade"]);
    $stmt->bindValue(":bairro", $dados["bairro"]);
    $stmt->bindValue(":complemento", $dados["complemento"]);
    $stmt->bindValue(":senha", $senhaHash);

    // Executar INSERT
    $stmt->execute();

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Cliente cadastrado com sucesso"
    ]);

} catch(PDOException $erro) {

    echo json_encode([
        "sucesso" => false,
        "mensagem" => $erro->getMessage()
    ]);

}
?>