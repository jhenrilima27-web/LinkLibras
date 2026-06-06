<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Configuração do banco de dados
$host = 'sql302.infinityfree.com'; 
$database = 'if0_41331569_teste';
$username = 'if0_41331569';
$password = 'TKo14JAk';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $username, $password);
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