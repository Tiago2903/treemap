<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;

class Controller
{
    public function getCurrency()
    { // awesomeapi aceita request sem apikey.
        $response = Http::acceptJson()
            ->get('https://economia.awesomeapi.com.br/last/USD-RUB,USD-JPY,USD-CHF,USD-CAD,USD-TRY,USD-MXN,USD-PLN,USD-SEK,USD-ILS,USD-SGD,USD-HKD');

        if ($response->ok()) { // Se não tiver nada de errado com a request, retorna um json.
            return $response->json();
        } else {
            return $this->_mocking(); // Default valor para caso qualquer problema durante a requisição aconteça.
        }
    }

    private function _mocking() // Função privada, age como um helper de certa maneira.
    {
        $mock = json_decode(file_get_contents("../resources/data/data.json")); // Request feita no dia 08/04/2024. Valor mockado para garantir uma response.
        return $mock;
    }
}
