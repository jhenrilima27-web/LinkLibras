<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Configuração do banco de dados
$host = "sql302.infinityfree.com";
$banco = "if0_41679144_linklibras_db";
$usuario = "if0_41679144";
$senhaBanco = "XSjVvTFvxk5m"; // Lembre-se de colocar a senha real aqui

try {
    // CORREÇÃO: Passando as variáveis corretas ($host, $banco, $usuario, $senhaBanco)
    $pdo = new PDO("mysql:host=$host;dbname=$banco;charset=utf8mb4", $usuario, $senhaBanco);
    
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Query para buscar os 6 primeiros intérpretes
    $sql = "SELECT 
                id, 
                nomeCompleto, 
                estado, 
                cidade, 
                descricao, 
                foto, 
                precoHora 
            FROM interpretes 
            ORDER BY id ASC 
            LIMIT 6";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    $interpretes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $response = [
        'interpretes' => $interpretes
    ];
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erro ao conectar ao banco de dados',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>