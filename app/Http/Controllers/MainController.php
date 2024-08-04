<?php

namespace App\Http\Controllers;

class MainController extends Controller
{
	public function index()
	{
		return view('index');
	}

	public function getCotacao()
	{
		$cotacao = $this->getCurrency();
		$cotacao_formatada = [];

		foreach ($cotacao as $key => $value) {
			$cotacao_formatada[$key] = [
				"moeda" => $value['name'],
				"codigo" => $value['codein'],
				"valor" => $value['bid'],
			];
		}

		echo json_encode($cotacao_formatada);
	}
}
